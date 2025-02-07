import React from "react";
import { View, Text, StyleSheet} from "react-native";

const Card = ({ Productname,  Price }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.Productname}>{Productname}</Text>
      <Text style={styles.Price}>{Price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    alignContent: 'center'
  },

  Productname: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  Price: {
    fontSize: 14,
  },
});

export default Card;
