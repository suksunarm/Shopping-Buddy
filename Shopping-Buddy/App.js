import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "./src/screens/homescreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Shop Buddy">
        
      <Stack.Screen name="Shop Buddy" component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
