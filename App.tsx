import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './screens';
import Summary from './screens/summary';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen name="index" component={Index} options={{headerShown:false}} />
        <Stack.Screen name="summary" component={Summary} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
