import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import Card from "../components/Card";



const STORAGE_KEY = "@card_data";

const homescreen = () => {
  const [Productname, setProductname] = useState("");
  const [Price, setPrice] = useState("");
  const [Errors, setErrors] = useState({
    Productname: "",
    Price: "",
  });
  const [Products, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  

  useEffect(() => {
    setFilteredProducts(
      Products.filter((product) =>
        product.Productname.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, [searchKey, Products]);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCards) {
        setProducts(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const validateField = (field, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (field === "Price" && isNaN(value)) {
        //ตรวจว่าเป็นรูปแบบอีเมลที่ถูกต้องไหม
        error = "โปรดป้อนตัวเลข";
      }
    }
    setErrors((preErrors) => ({ ...preErrors, [field]: error }));
    return error;
  };

  const addproduct = async () => {
    const ProductnameError = validateField("Productname", Productname);
    const PriceError = validateField("Price", Price);

    if (!ProductnameError && !PriceError) {
      setProductname("");
      setPrice("");
      setErrors({ Productname: "", Price: "" });
      const newIndex = Products.length + 1;
      const newCard = { id: Date.now().toString(), newIndex ,Productname, Price };
      const updatedProducts = [newCard, ...Products];
      const PriceTotal = Price + PriceTotal;

      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedProducts)
        );
        setProducts(updatedProducts); // อัพเดตสถานะของ Products
        setFilteredProducts(updatedProducts); //อัพเดตสถานะของ FilterdProducts
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const removeProduct = async (ProductID) => {
    try {
      let StoredProducts = await AsyncStorage.getItem(STORAGE_KEY); // ดึงสินค้าทั้งหมด
      let products = StoredProducts ? JSON.parse(StoredProducts) : [];
      let updatedProducts = products.filter((item) => item.id !== ProductID);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts)); // บันทึกค่าที่อัปเดตใหม่
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      console.log("ลบสินค้าสำเร็จ:", ProductID);
    } catch (error) {
      console.log("Error removing product", error);
    }
  };

  return (
    <View style={styles.ViewStyle}>
      <View>
        <Text style={styles.Title}>เพิ่มสินค้า</Text>
        <TextInput
          style={styles.Search}
          placeholder="Search by Name"
          value={searchKey}
          onChangeText={setSearchKey}
        />
      </View>


     
      <View style={styles.NavContainer}>
        <Text style={styles.TextInput}>ชื่อสินค้า</Text>

        <TextInput
          style={styles.input}
          placeholder="ใส่ชื่อสินค้า"
          value={Productname}
          onChangeText={(value) => setProductname(value)}
          onBlur={() => validateField("Productname", Productname)}
        />
        {Errors.Productname ? (
          <Text style={styles.errorText}>{Errors.Productname}</Text>
        ) : null}
        <Text style={styles.TextInput}>ราคาสินค้า</Text>
        <TextInput
          style={styles.input}
          placeholder="ใส่ราคาสินค้า"
          keyboardType="numeric"
          value={Price}
          onChangeText={(value) => setPrice(value)}
          onBlur={() => validateField("Price", Price)}
        />
        {Errors.Price ? (
          <Text style={styles.errorText}>{Errors.Price}</Text>
        ) : null}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.Button} onPress={addproduct}>
            <Text style={styles.ButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    

      <View style={styles.Container}>
      
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <Card Productname={`${item.newIndex} ${item.Productname}`} Price={item.Price} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.cardList}
        />
      </View>
      <Text style={{fontSize:20 , fontWeight:"bold" , marginLeft:25 , marginBottom:15}}>{`ผลรวมราคาของสินค้า : `}</Text>

      
    </View>
    
  );
};

const styles = StyleSheet.create({
  ViewStyle: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  NavContainer: {
    position: "relative",
    top: "2.5%",
    marginHorizontal: "auto",
    width: "85%",
    height: "auto",
    borderRadius: 25,
    backgroundColor: "#caf16b",
    borderColor: "white",
    borderWidth: 2,
    elevation: 5,
  },

  Container: {
    flex: 1,
    padding: 20,
  },

  Title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 12,
    padding: 7,
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 40,
    height: 40,
  },

  TextInput: {
    fontSize: 18,
    marginLeft: 25,
    marginTop: 25,
  },

  errorText: {
    color: "white",
    position: "relative",
    left: 10,
  },

  cardList: {
    marginTop: 20,
  },

  ActionButton: {
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "flex-end",
    height: "100%",
    paddingHorizontal: 20,
  },

  ActionText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  Button: {
    backgroundColor: "#f8f3f5",
    borderColor: "white",
    borderWidth: 2,
    marginTop: 10,
    marginBottom: "10",
    borderRadius: 8,
    width: 75,
    height: 45,
    justifyContent: "center",
  },

  ButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  Search: {
    borderWidth: 1,
    borderColor: "gold",
    borderRadius: 12,
    padding: 7,
    fontSize: 18,
    height: 40,
    marginHorizontal: 30,
    position:"absolute",
    right:0,
    top: 12
  }
});

export default homescreen;
