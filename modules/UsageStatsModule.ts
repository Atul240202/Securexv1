import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR = `The package 'UsageStatsModule' doesn't seem to be linked. Make sure:
- You rebuilt the app after installing the native module
- You are not using Expo Go (must use dev client or bare workflow)`;

const UsageStatsModule = NativeModules.UsageStatsModule
  ? NativeModules.UsageStatsModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function isUsageAccessGranted() {
  if (Platform.OS !== 'android') return Promise.resolve(true);
  return UsageStatsModule.isUsageAccessGranted();
}
export function openUsageAccessSettings() {
  if (Platform.OS !== 'android') return;
  UsageStatsModule.openUsageAccessSettings();
}
export function getTodayUsageStats() {
  if (Platform.OS !== 'android') return Promise.resolve([]);
  return UsageStatsModule.getTodayUsageStats();
}
export function getTodayScreenOnTime() {
  if (Platform.OS !== 'android') return Promise.resolve(0);
  return UsageStatsModule.getTodayScreenOnTime();
}
