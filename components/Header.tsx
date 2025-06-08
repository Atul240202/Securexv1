import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>SecurX</Text>
      {/* <Text style={styles.activeTime}>{activeTime}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    elevation: 3,
    zIndex: 101,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#212121',
  },
  activeTime: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b7bec',
  },
});
