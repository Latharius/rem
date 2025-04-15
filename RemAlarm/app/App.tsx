import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddAlarmScreen from './screens/AddAlarmScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Alarms' }} />
            <Stack.Screen name="AddAlarm" component={AddAlarmScreen} options={{ title: 'Add Alarm' }} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;