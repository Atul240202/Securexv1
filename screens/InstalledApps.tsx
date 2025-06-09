import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainLayout from '../layouts/MainLayout';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getInstalledAppCount} from '../modules/AppListModule';

const riskColors = {
  High: {bg: '#fde8e8', color: '#d32f2f'},
  Medium: {bg: '#fff9c4', color: '#f9a825'},
  Low: {bg: '#e8f5e9', color: '#388e3c'},
};

interface App {
  name: string;
  packageName: string;
  icon?: string;
  permissions?: string[];
}

type RiskLevel = 'High' | 'Medium' | 'Low';

function getRisk(app: App): RiskLevel {
  const criticals: string[] = [
    'CAMERA',
    'RECORD_AUDIO',
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    'READ_CONTACTS',
    'READ_SMS',
    'SEND_SMS',
    'CALL_PHONE',
    'READ_CALL_LOG',
  ];
  const found: string[] =
    app.permissions?.filter((p: string) =>
      criticals.some((c: string) => p.toUpperCase().includes(c)),
    ) || [];
  if (found.length >= 3) return 'High';
  if (found.length === 2) return 'Medium';
  return 'Low';
}

type RootStackParamList = {
  InstalledApps: undefined;
  InternalAppDetailsScreen: {appName: string};
  Dashboard: undefined;
  PermissionsOverview: undefined;
};

export default function InstalledApps() {
  const [search, setSearch] = useState('');
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setLoading(true);
    getInstalledAppCount()
      .then(setApps)
      .finally(() => setLoading(false));
  }, []);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <MainLayout current="InstalledApps" activeTime="N/A">
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#4b7bec" />
          <Text>Loading installed apps...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout current="InstalledApps" activeTime="N/A">
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Installed Apps</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps..."
          placeholderTextColor="black"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.appList}>
          {filteredApps.map((app, idx) => (
            <TouchableOpacity
              key={app.packageName || idx}
              style={styles.appCard}
              onPress={() =>
                navigation.navigate('InternalAppDetailsScreen', {
                  appName: app.packageName,
                })
              }>
              {/* Use app icon if possible, else fallback icon */}
              {app.icon?.startsWith('data:image') ? (
                <Image
                  source={{uri: app.icon}}
                  style={styles.appIconImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name={'apps'}
                  size={36}
                  color="#4b7bec"
                  style={styles.appIconImage}
                />
              )}
              <View style={styles.appInfo}>
                <View style={styles.appNameRow}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text
                    style={{
                      ...styles.riskTag,
                      backgroundColor: riskColors[getRisk(app)].bg,
                      color: riskColors[getRisk(app)].color,
                    }}>
                    {getRisk(app)} Risk
                  </Text>
                </View>
                <Text style={styles.description}>{app.packageName}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {app.permissions?.length || 0} permissions
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: 'black',
    fontSize: 15,
    marginBottom: 16,
  },
  appList: {
    gap: 16,
  },
  appCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appIconImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#e5e7eb',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  appInfo: {
    flex: 1,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appName: {
    fontWeight: '600',
    fontSize: 15,
    marginRight: 8,
  },
  riskTag: {
    fontSize: 12,
    fontWeight: '600',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  description: {
    fontSize: 13,
    color: '#757575',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#bdbdbd',
  },
});
