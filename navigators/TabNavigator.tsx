import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import InstalledApps from '../screens/InstalledApps';
import PermissionsOverview from '../screens/PermissionsOverview';
import InternalAppDetailsScreen from '../screens/InternalAppDetailsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} tabBar={() => null}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="InstalledApps" component={InstalledApps} />
      <Tab.Screen name="PermissionsOverview" component={PermissionsOverview} />
      <Tab.Screen
        name="InternalAppDetails"
        component={InternalAppDetailsScreen}
      />
    </Tab.Navigator>
  );
}
