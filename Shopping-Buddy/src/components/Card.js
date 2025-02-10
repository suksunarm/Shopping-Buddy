import React from "react";
import { View, Text, StyleSheet, TouchableOpacity , Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Card = ({ Productname, Price, category , ImageUrl ,Ondelete, OnEdit , OnBuy , backgroundColor }) => {
  console.log("Card backgroundColor:", backgroundColor); // ตรวจสอบค่าที่ส่งมา
  
  
  return (
    <View style={[styles.card, {backgroundColor}]}>
       <Image source={{ uri: ImageUrl }} style={styles.image} />  
      <Text style={styles.Productname}>{Productname}</Text>
      <Text style={styles.Price}>{Price}</Text>
      <Text style={styles.productText}>{category}</Text> 
    
      <TouchableOpacity onPress={OnBuy}>
        <Icon
          name="credit-card"
          size={20}
          color="black"
          style={styles.IconBuy}
        ></Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Ondelete}>
        <Icon
          name="trash-alt"
          size={20}
          color="black"
          style={styles.IconDelete}
        ></Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={OnEdit}>
        <Icon
          name="edit"
          size={20}
          color="black"
          style={styles.IconEdit}
        ></Icon>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    borderWidth:1,
    margin: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    alignContent: "center",
    backgroundColor:"white"
  },

  Productname: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  Price: {
    fontSize: 14,
  },

  IconDelete: {
    marginLeft: 5,
    position: "absolute",
    left: 250,
    bottom: 0,
  },

  IconEdit: {
    marginLeft: 5,
    position: "absolute",
    left: 200,
    bottom: 0,
  },

  IconBuy: {
    marginLeft: 5,
    position: "absolute",
    left: 150,
    bottom: -2
    
  },
  image: {
    width: 100,  // ปรับขนาดภาพ
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Card;
