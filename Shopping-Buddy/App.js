import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import homescreen from "./src/screens/homescreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        
      <Stack.Screen name="home" component={homescreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
