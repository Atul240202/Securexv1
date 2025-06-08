import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../components/Header';
import FloatingNavBar from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  current: 'dashboard' | 'InstalledApps' | 'PermissionsOverview';
  activeTime?: string; // or whatever props you want for header
}

export default function MainLayout({
  children,
  current,
  activeTime = 'N/A',
}: MainLayoutProps) {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>{children}</View>
      <FloatingNavBar current={current} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
});
