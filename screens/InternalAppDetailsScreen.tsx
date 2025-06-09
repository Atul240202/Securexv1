import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {getInstalledAppCount} from '../modules/AppListModule';

// ---------- TYPES ----------
type RootStackParamList = {
  InternalAppDetailsScreen: {appName: string};
};

type AppPermission = {
  name: string;
  desc: string;
  granted: boolean;
};

type AppDetails = {
  name: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
  usage: {
    dailyMinutes: number;
    lastUsed: string;
  };
  permissions: AppPermission[];
  suggestions: string[];
};

// ---------- COLOR MAPPING ----------
const riskBadgeColor = {
  High: '#ef4444', // red
  Medium: '#f59e0b', // yellow
  Low: '#10b981', // green
};

// ---------- COMPONENT ----------
export default function InternalAppDetailsScreen() {
  const route =
    useRoute<RouteProp<RootStackParamList, 'InternalAppDetailsScreen'>>();
  const navigation = useNavigation();
  const {appName} = route.params;
  const [app, setApp] = useState(null);

  useEffect(() => {
    getInstalledAppCount().then(apps => {
      // Find app with matching package name
      const found = apps.find(a => a.packageName === appName);
      setApp(found);
    });
  }, [appName]);

  if (!app) {
    return (
      <MainLayout current="InstalledApps" activeTime="N/A">
        <View style={styles.container}>
          <Text style={{color: 'red', fontSize: 16}}>
            App data not found for "{appName}".
          </Text>
        </View>
      </MainLayout>
    );
  }

  // Calculate risk
  const criticals = [
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
  const criticalPerms =
    app.permissions?.filter(p =>
      criticals.some(c => p.toUpperCase().includes(c)),
    ) || [];
  let risk: 'Low' | 'Medium' | 'High' = 'Low';
  if (criticalPerms.length >= 3) risk = 'High';
  else if (criticalPerms.length === 2) risk = 'Medium';

  // Suggestions Example
  const suggestions = [];
  if (risk === 'High')
    suggestions.push(
      'Review and revoke unnecessary permissions in your system settings.',
    );
  if (app.permissions?.includes('android.permission.ACCESS_FINE_LOCATION'))
    suggestions.push('Disable location access if not required.');
  if (app.permissions?.includes('android.permission.CAMERA'))
    suggestions.push('Turn off camera access for extra privacy.');

  return (
    <MainLayout current="InstalledApps" activeTime="N/A">
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>App Details</Text>
        </View>

        {/* App Summary Card */}
        <View style={styles.card}>
          <Text style={styles.appName}>{app.name}</Text>
          <Text style={styles.appDesc}>{app.packageName}</Text>
          <View
            style={{
              backgroundColor:
                risk === 'High'
                  ? '#ef444420'
                  : risk === 'Medium'
                  ? '#f59e0b20'
                  : '#10b98120',
              alignSelf: 'flex-start',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              marginTop: 8,
            }}>
            <Text style={styles.riskText}>{risk} Risk</Text>
          </View>
          <View style={styles.usageRow}>
            <View style={styles.usageBox}>
              <Text style={styles.usageValue}>
                {app.permissions?.length || 0}
              </Text>
              <Text style={styles.usageLabel}>Permissions</Text>
            </View>
          </View>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          {app.permissions &&
            app.permissions.map(perm => (
              <View key={perm} style={styles.permissionItem}>
                <Text style={styles.permissionIcon}>📌</Text>
                <View>
                  <Text style={styles.permissionName}>{perm}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.sectionTitle}>Security Suggestions</Text>
            {suggestions.map((sug, idx) => (
              <Text key={idx} style={styles.suggestionText}>
                ⚠️ {sug}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
}
// ---------- HELPER FUNCTION ----------
const getRiskBadgeStyle = (risk: 'Low' | 'Medium' | 'High') => ({
  backgroundColor: `${riskBadgeColor[risk]}20`,
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  marginTop: 8,
});

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
  },
  appDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  usageBox: {
    flex: 1,
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  usageLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  permissionName: {
    fontSize: 14,
    fontWeight: '500',
  },
  permissionDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  check: {
    marginLeft: 'auto',
    fontSize: 16,
  },
  usageDetail: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  suggestionsBox: {
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  suggestionText: {
    fontSize: 13,
    color: '#b45309',
    marginBottom: 6,
  },
});
