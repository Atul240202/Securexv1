import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainLayout from '../layouts/MainLayout';
import {getInstalledAppCount} from '../modules/AppListModule';
import {
  isUsageAccessGranted,
  openUsageAccessSettings,
  getTodayUsageStats,
  getTodayScreenOnTime,
} from '../modules/UsageStatsModule';
import UsageAccessModal from '../components/UsageAccessModal';

const criticalPermissions = [
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

export default function DashboardScreen({navigation}) {
  const [stats, setStats] = useState({totalApps: 0, riskApps: 0, topApps: []});
  const [screenTime, setScreenTime] = useState(0);
  const [usageApps, setUsageApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check usage access permission on mount
  useEffect(() => {
    isUsageAccessGranted().then(granted => setShowModal(!granted));
  }, []);

  // Fetch stats
  useEffect(() => {
    setLoading(true);
    fetchAllData().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    getTodayUsageStats()
      .then(stats => {
        console.log('Today usage stats:', stats);
        // You can update state here to show it in the UI
      })
      .catch(err => {
        console.warn('Failed to get today usage stats:', err);
      });
  }, []);

  function fetchAllData() {
    setRefreshing(true);

    return Promise.all([
      getInstalledAppCount().then(apps => {
        const totalApps = apps.length;
        const riskApps = apps.filter(app =>
          app.permissions?.some(p =>
            criticalPermissions.some(crit => p.toUpperCase().includes(crit)),
          ),
        ).length;
        const topApps = [...apps]
          .sort(
            (a, b) =>
              (b.permissions?.length || 0) - (a.permissions?.length || 0),
          )
          .slice(0, 5)
          .map(app => ({
            name: app.name,
            usageMinutes: app.permissions?.length || 0,
            icon: 'apps',
          }));
        setStats({totalApps, riskApps, topApps});
      }),

      // Get screen-on time
      getTodayScreenOnTime()
        .then(sec => setScreenTime(sec))
        .catch(() => setScreenTime(0)),

      // Get usage stats
      getTodayUsageStats()
        .then(apps => setUsageApps(apps || []))
        .catch(() => setUsageApps([])),
    ]).finally(() => setRefreshing(false));
  }

  // Human-readable time
  function formatTime(secs) {
    if (!secs) return '--';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m} min`;
  }

  if (loading) {
    return (
      <MainLayout current="dashboard" activeTime="--">
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#4b7bec" />
          <Text>Loading dashboard data...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout current="dashboard" activeTime={formatTime(screenTime)}>
      <UsageAccessModal
        visible={showModal}
        onRequest={() => {
          openUsageAccessSettings();
          setShowModal(false);
        }}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllData} />
        }>
        <Text style={styles.title}>
          <Icon name="shield-check" size={28} color="#4b7bec" /> SecurX
        </Text>
        <Text style={styles.subtitle}>Mobile Security Dashboard</Text>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Icon name="cellphone" size={28} color="#4b7bec" />
            <Text style={styles.cardNumber}>{stats.totalApps}</Text>
            <Text style={styles.cardLabel}>Installed Apps</Text>
          </View>
          <View style={[styles.card, styles.cardDanger]}>
            <Icon name="alert-circle-outline" size={28} color="#eb3b5a" />
            <Text style={[styles.cardNumber, {color: '#eb3b5a'}]}>
              {stats.riskApps}
            </Text>
            <Text style={styles.cardLabel}>Risk Apps</Text>
          </View>
        </View>

        <View style={styles.timeCard}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="clock-outline" size={24} color="#20bf6b" />
            <Text style={{marginLeft: 8, fontSize: 18, fontWeight: '600'}}>
              {formatTime(screenTime)}
            </Text>
          </View>
          <View style={styles.todayTag}>
            <Text style={styles.todayText}>Screen-on Today</Text>
          </View>
        </View>

        <View style={styles.usageCard}>
          <Text style={styles.usageTitle}>Top 5 Apps by Usage</Text>
          {usageApps
            .sort(
              (a, b) =>
                (b.totalTimeInForeground || 0) - (a.totalTimeInForeground || 0),
            )
            .slice(0, 5)
            .map(app => (
              <View key={app.packageName} style={styles.usageRow}>
                <Icon name="apps" size={22} color="#333" style={{width: 30}} />
                <Text style={{flex: 1}}>{app.appName}</Text>
                <View style={styles.usageBarContainer}>
                  <View
                    style={[
                      styles.usageBar,
                      {
                        width: `${
                          ((app.totalTimeInForeground || 0) /
                            (usageApps[0]?.totalTimeInForeground || 1)) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={{width: 55, textAlign: 'right'}}>
                  {Math.round((app.totalTimeInForeground || 0) / 60000)} min
                </Text>
              </View>
            ))}
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate('InstalledApps')}>
            <Icon name="shield-outline" size={20} color="#4b7bec" />
            <Text style={styles.bottomBtnText}>View All Apps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, styles.bottomButtonGreen]}
            onPress={() => navigation.navigate('PermissionsOverview')}>
            <Icon name="alert-circle-outline" size={20} color="#20bf6b" />
            <Text style={[styles.bottomBtnText, {color: '#20bf6b'}]}>
              Permissions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

// Keep your styles here (reuse your current styles)

const styles = StyleSheet.create({
  container: {padding: 20, backgroundColor: '#f9fafb', minHeight: '100%'},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 2,
  },
  cardDanger: {borderColor: '#eb3b5a', borderWidth: 1},
  cardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#222',
  },
  cardLabel: {fontSize: 15, color: '#555'},
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },
  todayTag: {
    backgroundColor: '#f1f2f6',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  todayText: {color: '#888', fontSize: 13},
  usageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 22,
    elevation: 2,
  },
  usageTitle: {fontWeight: 'bold', fontSize: 16, marginBottom: 10},
  usageRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 7},
  usageBarContainer: {
    flex: 1,
    height: 7,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  usageBar: {height: 7, borderRadius: 5, backgroundColor: '#222'},
  bottomRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
    justifyContent: 'center',
  },
  bottomButtonGreen: {backgroundColor: '#eafaf1', borderColor: '#20bf6b'},
  bottomBtnText: {
    marginLeft: 7,
    color: '#4b7bec',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
