import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './navigators/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
