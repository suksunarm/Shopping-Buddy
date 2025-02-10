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
    justifyContent:"center",
    borderRadius: 5,
    width: 300,
    height: 45,
    margin: 5,
    borderRadius: 10
  },
  text: {
    fontWeight:"bold",
    fontSize: 15,
    textAlign: "center"
  },
});

export default CustomButton;
