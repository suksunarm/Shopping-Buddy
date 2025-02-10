import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import homescreen from "./src/screens/homescreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Shopping Buddy">
        
      <Stack.Screen name="Shopping Buddy" component={homescreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
