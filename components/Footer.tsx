import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

export default function FloatingNavBar({current}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={[styles.iconWrap, current === 'dashboard' && styles.active]}>
        <Ionicons
          name="home"
          size={26}
          color={current === 'dashboard' ? '#4b7bec' : '#222'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('InstalledApps')}
        style={[styles.iconWrap, current === 'InstalledApps' && styles.active]}>
        <MaterialCommunityIcons
          name="apps"
          size={26}
          color={current === 'InstalledApps' ? '#4b7bec' : '#222'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('PermissionsOverview')}
        style={[
          styles.iconWrap,
          current === 'PermissionsOverview' && styles.active,
        ]}>
        <MaterialCommunityIcons
          name="shield-check"
          size={26}
          color={current === 'PermissionsOverview' ? '#4b7bec' : '#222'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 12,
    elevation: 8,
    shadowColor: '#222',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    zIndex: 100,
  },
  iconWrap: {
    padding: 8,
    borderRadius: 50,
  },
  active: {
    backgroundColor: '#e6f0fd',
  },
});
