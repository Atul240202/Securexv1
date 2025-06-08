import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR = `The package 'AppListModule' doesn't seem to be linked. Make sure: ...`;

const AppListModule = NativeModules.AppListModule
  ? NativeModules.AppListModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function getInstalledAppCount() {
  if (Platform.OS === 'android') {
    return AppListModule.getInstalledApps();
  }
  return Promise.resolve(0);
}
