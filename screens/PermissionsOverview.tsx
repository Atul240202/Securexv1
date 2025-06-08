// Rewritten version for React Native CLI

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {permissionsOverview} from '../data/mockData';

const iconMap = {
  camera: '📷',
  'map-pin': '📍',
  microphone: '🎤',
  'account-multiple': '👥',
};

const levelColors = {
  Critical: {bg: '#fde8e8', color: '#d32f2f', border: '#d32f2f'},
  Moderate: {bg: '#fff9c4', color: '#f9a825', border: '#f9a825'},
  Normal: {bg: '#e8f5e9', color: '#388e3c', border: '#388e3c'},
};

export default function PermissionsOverview() {
  const {counts, groups} = permissionsOverview;
  const navigation = useNavigation();

  return (
    <MainLayout current="PermissionsOverview" activeTime="N/A">
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Permissions Overview</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryCount, {color: '#d32f2f'}]}>
              {counts.critical}
            </Text>
            <Text style={[styles.summaryLabel, {color: '#d32f2f'}]}>
              ⚠️ Critical
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryCount, {color: '#f9a825'}]}>
              {counts.moderate}
            </Text>
            <Text style={[styles.summaryLabel, {color: '#f9a825'}]}>
              👁️ Moderate
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryCount, {color: '#388e3c'}]}>
              {counts.normal}
            </Text>
            <Text style={[styles.summaryLabel, {color: '#388e3c'}]}>
              🛡️ Normal
            </Text>
          </View>
        </View>

        {groups.map(grp => (
          <View key={grp.level}>
            <Text
              style={[
                styles.levelTag,
                {
                  backgroundColor: levelColors[grp.level].bg,
                  color: levelColors[grp.level].color,
                },
              ]}>
              {grp.level}
            </Text>
            <Text style={styles.levelTitle}>{grp.level} Permissions</Text>
            <View style={styles.permissionList}>
              {grp.permissions.map(perm => (
                <View
                  key={perm.name}
                  style={[
                    styles.permissionCard,
                    {borderLeftColor: levelColors[grp.level].border},
                  ]}>
                  <View style={styles.permissionHeader}>
                    <Text style={styles.permissionIcon}>
                      {iconMap[perm.icon]}
                    </Text>
                    <Text style={styles.permissionName}>{perm.name}</Text>
                    <Text
                      style={[
                        styles.permissionLevelTag,
                        {
                          backgroundColor: levelColors[grp.level].bg,
                          color: levelColors[grp.level].color,
                        },
                      ]}>
                      {grp.level}
                    </Text>
                  </View>
                  <Text style={styles.permissionDesc}>{perm.desc}</Text>
                  <Text style={styles.appListLabel}>
                    Apps using this permission ({perm.apps.length}):
                  </Text>
                  <View style={styles.appChips}>
                    {perm.apps.map(app => (
                      <Text key={app} style={styles.appChip}>
                        {app}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
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
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },
  backText: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  summaryCount: {
    fontWeight: '700',
    fontSize: 20,
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  levelTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  levelTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  permissionList: {
    marginBottom: 24,
  },
  permissionCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  permissionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  permissionName: {
    fontSize: 15,
    fontWeight: '600',
  },
  permissionLevelTag: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '600',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  permissionDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  appListLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  appChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  appChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    color: '#374151',
    marginRight: 6,
    marginBottom: 6,
  },
});
