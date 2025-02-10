import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
  Image,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import Card from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome5";
import CheckBox from "react-native-check-box";
import {launchImageLibrary } from "react-native-image-picker";

const STORAGE_KEY = "@card_data";
const BOUGHT_ITEMS_KEY = "@bought_items";
const COLOR_STATUS_KEY = "@color_status";

const homeScreen = ({ navigation }) => {
  const [Productname, setProductname] = useState("");
  const [Price, setPrice] = useState("");
  const [Errors, setErrors] = useState({
    Productname: "",
    Price: "",
  });
  const [Products, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState({});
  const [BoughtItem, setBoughtItem] = useState([]);
  const [RealPrice, setRealPrice] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false); // สร้าง state คุมโหมด
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    setFilteredProducts(
      Products.filter((product) =>
        product.Productname.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, [searchKey, Products]);

  useEffect(() => {
    const calculateRealPrice = () => {
      const totalNotBoughtPrice = Products.reduce(
        (sum, item) => (!BoughtItem.includes(item.id) ? sum + item.Price : sum),
        0
      );
      setRealPrice(totalNotBoughtPrice);
    };

    calculateRealPrice();
  }, [Products, BoughtItem]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem(STORAGE_KEY);
        const storedBoughtItems = await AsyncStorage.getItem(BOUGHT_ITEMS_KEY);
        const storedStatus = await AsyncStorage.getItem(COLOR_STATUS_KEY);

        if (storedProducts) setProducts(JSON.parse(storedProducts));
        if (storedBoughtItems) setBoughtItem(JSON.parse(storedBoughtItems));
        if (storedStatus) setStatus(JSON.parse(storedStatus));
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filteredList = Products;

    if (category === "Food") {
      filteredList = Products.filter((product) => product.category === "Food");
    } else if (category === "Skincare") {
      filteredList = Products.filter(
        (product) => product.category === "Skincare"
      );
    }

    setFilteredProducts(filteredList);
  }, [category, Products]);

  const validateField = (field, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else if (field === "Price" && (isNaN(value) || Number(value) <= 0)) {
      error = "โปรดป้อนตัวเลขที่มีค่าเป็นบวก";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return error;
  };

  const addProduct = async () => {
    const ProductnameError = validateField("Productname", Productname);
    const PriceError = validateField("Price", Price);

    if (!ProductnameError && !PriceError) {
      setErrors({ Productname: "", Price: "" });

      let updatedProducts;
      if (editId) {
        updatedProducts = Products.map((item) =>
          item.id === editId
            ? { ...item, Productname, Price: Number(Price) }
            : item
        );
      } else {
        const newCard = {
          id: Date.now().toString(),
          Productname,
          Price: Number(Price),
          category: category || "Skincare", // เพิ่ม category
          imageUrl: imageUrl,
        };
        updatedProducts = [newCard, ...Products];
      }

      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedProducts)
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setIsVisible(false);
        setEditId(null);
        setProductname("");
        setPrice("");
        setImageUrl("");
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const removeProduct = async (ProductID) => {
    try {
      const updatedProducts = Products.filter((item) => item.id !== ProductID);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error removing product", error);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(BOUGHT_ITEMS_KEY);
      await AsyncStorage.removeItem(COLOR_STATUS_KEY);
      setProducts([]);
      setFilteredProducts([]);
      setBoughtItem([]);
      setStatus({});
    } catch (error) {
      console.error("Error clearing data", error);
    }
  };

  const editProduct = (product) => {
    setProductname(product.Productname);
    setPrice(product.Price.toString());
    setEditId(product.id);
    setIsVisible(true);
  };

  const handleBuy = async (id) => {
    const updatedBoughtItems = BoughtItem.includes(id)
      ? BoughtItem.filter((item) => item !== id)
      : [...BoughtItem, id];

    const updatedStatus = {
      ...status,
      [id]: BoughtItem.includes(id) ? "white" : "#bcda60",
    };

    try {
      await AsyncStorage.setItem(
        BOUGHT_ITEMS_KEY,
        JSON.stringify(updatedBoughtItems)
      );
      await AsyncStorage.setItem(
        COLOR_STATUS_KEY,
        JSON.stringify(updatedStatus)
      );
      setBoughtItem(updatedBoughtItems);
      setStatus(updatedStatus);
    } catch (error) {
      console.error("Error updating bought items or status", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev); // สลับค่า true/false
  };

  // ฟังก์ชันเรียกแกลเลอรี
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1, // กำหนดคุณภาพของภาพ (0-1)
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled gallery picker");
        } else if (response.errorCode) {
          console.log("Gallery Error: ", response.errorCode);
        } else {
          const source = { uri: response.assets[0].uri }; // เอาภาพจากผลลัพธ์
          setImageUrl(source.uri);
        }
      }
    );
  };


  return (
    <View
      style={[
        styles.ViewStyle,
        { backgroundColor: isDarkMode ? "#121212" : "#fff" },
      ]}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.Title, { color: isDarkMode ? "#fff" : "#000" }]}>
          จัดการรายการสินค้า
        </Text>

        <Text
          style={[
            styles.DarkModeText,
            { color: isDarkMode ? "#fff" : "#000", fontSize: 18 },
          ]}
        >
          Toggle Theme :
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme}></Switch>
      </View>

      <TextInput
        style={[
          styles.Search,
          { color: isDarkMode ? "#fff" : "#000", fontSize: 18 },
        ]}
        placeholder="Search by Name"
        placeholderTextColor={isDarkMode ? "#fff" : "#000"}
        value={searchKey}
        onChangeText={setSearchKey}
      />

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={styles.category}
          onPress={() => setCategory("All")}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.category}
          onPress={() => setCategory("Food")}
        >
          <Text style={styles.categoryText}>Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.category}
          onPress={() => setCategory("Skincare")}
        >
          <Text style={styles.categoryText}>Skincare</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.Container}>
        <Modal transparent={true} animationType="fade" visible={isVisible}>
          <View style={styles.ModalOverlay}>
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

              <Text style={styles.TextInput}>
                เลือกรูปภาพจากแกลอรี่
              </Text>
              <Button title="Open Gallery" onPress={openGallery} />

              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={styles.checkbox}
                  isChecked={category === "Food"}
                  onClick={() => setCategory("Food")}
                />
                <Text>Food</Text>
                <CheckBox
                  style={styles.checkbox}
                  isChecked={category === "Skincare"}
                  onClick={() => setCategory("Skincare")}
                />
                <Text>Skincare</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity style={styles.Button} onPress={addProduct}>
                  <Text style={styles.ButtonText}>CONFIRM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.CancleButton}
                  onPress={() => {
                    setIsVisible(false);
                    setProductname("");
                    setPrice("");
                  }}
                >
                  <Icon name="door-open" size={36} color="white"></Icon>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              Productname={`Name : ${item.Productname}`}
              Price={`Price : ${item.Price}฿`}
              category={`Category : ${item.category}`}
              ImageUrl={item.imageUrl}
              Ondelete={() => removeProduct(item.id)}
              OnEdit={() => editProduct(item)}
              backgroundColor={status[item.id] || "white"}
              OnBuy={() => handleBuy(item.id)}
            />
          )}
          contentContainerStyle={styles.cardList}
        />
      </View>
      <View style={{ alignItems: "center", marginBottom: 15 }}>
        <CustomButton
          title="ADD YOUR PRODUCTS"
          onPress={() => setIsVisible(true)}
          backgroundColor="#0084f3"
          color="white"
        />

        <CustomButton
          title="CLEAR ALL"
          onPress={clearAll}
          backgroundColor="#c0004e"
          color="white"
        />
      </View>

      <Text
        style={[
          {
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 25,
            marginBottom: 15,
          },
          { color: isDarkMode ? "#fff" : "#000", fontSize: 18 },
        ]}
      >{`SUM OF PRODUCTS(Not Paid) : ${RealPrice}฿`}</Text>
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
    backgroundColor: "#feebe6",
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
    borderColor: "gray",
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
    color: "red",
    position: "relative",
    left: 45,
    top: 2.5,
  },

  cardList: {
    marginTop: 20,
  },

  Button: {
    backgroundColor: "#add237",
    borderColor: "gray",
    borderWidth: 2,
    marginTop: 10,
    marginBottom: "10",
    borderRadius: 15,
    width: 120,
    height: 45,
    justifyContent: "center",
  },

  CancleButton: {
    backgroundColor: "red",
    borderColor: "gray",
    borderWidth: 2,
    marginTop: 10,
    marginBottom: "10",
    borderRadius: 15,
    width: 120,
    height: 45,
    justifyContent: "center",
  },

  ButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  Search: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 12,
    padding: 7,
    fontSize: 18,
    height: 40,
    marginHorizontal: 30,
    marginTop: 10,
  },

  ModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  ModalContainer: {
    width: 300,
    backgroundColor: "#E7FBB4",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 20,
  },

  Addproductbutton: {
    fontWeight: "bold",
  },

  DarkMode: {
    backgroundColor: "black",
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 110,
    height: 45,
    margin: 5,
    borderRadius: 40,
  },

  DarkModeText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "black",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#0084f3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: 12,
  },

  category: {
    backgroundColor: "purple",
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 75,
    height: 40,
    margin: 5,
    borderRadius: 10,
  },

  categoryText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
});

export default homeScreen;
