import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function UsageAccessModal({visible, onRequest}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Usage Access Required</Text>
          <Text style={styles.desc}>
            To show app usage and screen-on time stats, please grant "Usage
            Access" to this app in your device settings.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onRequest}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {fontWeight: 'bold', fontSize: 18, marginBottom: 10},
  desc: {fontSize: 15, textAlign: 'center', marginBottom: 18, color: '#555'},
  button: {
    backgroundColor: '#4b7bec',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
