import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {internalAppDetails} from '../data/mockData';

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

  const app: AppDetails | undefined = internalAppDetails[appName];

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
          <Text style={styles.appDesc}>{app.description}</Text>
          <View style={getRiskBadgeStyle(app.risk)}>
            <Text style={styles.riskText}>{app.risk} Risk</Text>
          </View>
          <View style={styles.usageRow}>
            <View style={styles.usageBox}>
              <Text style={styles.usageValue}>{app.usage.dailyMinutes}m</Text>
              <Text style={styles.usageLabel}>Daily Usage</Text>
            </View>
            <View style={styles.usageBox}>
              <Text style={styles.usageValue}>{app.permissions.length}</Text>
              <Text style={styles.usageLabel}>Permissions</Text>
            </View>
          </View>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          {app.permissions.map(perm => (
            <View key={perm.name} style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>📌</Text>
              <View>
                <Text style={styles.permissionName}>{perm.name}</Text>
                <Text style={styles.permissionDesc}>{perm.desc}</Text>
              </View>
              {perm.granted && <Text style={styles.check}>✅</Text>}
            </View>
          ))}
        </View>

        {/* Usage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Statistics</Text>
          <Text style={styles.usageDetail}>
            Daily Average: {app.usage.dailyMinutes} minutes
          </Text>
          <Text style={styles.usageDetail}>
            Last used: {app.usage.lastUsed}
          </Text>
        </View>

        {/* Suggestions Section */}
        {app.suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.sectionTitle}>Security Suggestions</Text>
            {app.suggestions.map((sug, idx) => (
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
