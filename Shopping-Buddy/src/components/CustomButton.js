import React from "react";
import {  Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = ({ title, onPress, backgroundColor , color}) => {
  return (
    <TouchableOpacity
      style={[styles.Button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "gold",
    padding: 10,
    alignContent: "center",
    borderRadius: 5,
  },
  text: {
    
    fontSize: 15,
    textAlign: "center"
  },
});

export default CustomButton;
