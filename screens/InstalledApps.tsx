import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainLayout from '../layouts/MainLayout';
import {useNavigation} from '@react-navigation/native';
import {internalAppDetails} from '../data/mockData';

const riskColors = {
  High: {bg: '#fde8e8', color: '#d32f2f'},
  Medium: {bg: '#fff9c4', color: '#f9a825'},
  Low: {bg: '#e8f5e9', color: '#388e3c'},
};

export default function InstalledApps() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  // Convert object to array
  const apps = Object.values(internalAppDetails);

  // Filter apps by search term
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()),
  );

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
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.appList}>
          {filteredApps.map((app: any) => (
            <TouchableOpacity
              key={app.id}
              style={styles.appCard}
              onPress={() =>
                navigation.navigate(
                  'InternalAppDetailsScreen' as never,
                  {appName: app.id} as never,
                )
              }>
              {/* You can use an icon or a placeholder image */}
              <Ionicons
                name={app.icon || 'apps'}
                size={36}
                color="#4b7bec"
                style={styles.appIconImage}
              />
              <View style={styles.appInfo}>
                <View style={styles.appNameRow}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text
                    style={{
                      ...styles.riskTag,
                      backgroundColor: riskColors[app.risk].bg,
                      color: riskColors[app.risk].color,
                    }}>
                    {app.risk} Risk
                  </Text>
                </View>
                <Text style={styles.description}>{app.description}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {app.permissions.length} permissions
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
