import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import Card from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome5";

const STORAGE_KEY = "@card_data";

const homescreen = ({ navigation }) => {
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
  const [editId, setEditId] = useState(null); // เก็บ ID ของสินค้าที่ต้องการแก้ไข
  const [status, setStatus] = useState({}); //เก็บค่าสเตตัสของสินค้าที่ถูกซื้อ

  useEffect(() => {
    setFilteredProducts(
      Products.filter((product) =>
        product.Productname.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, [searchKey, Products]);

  useEffect(() => {
    loadCards();
    const loadColorStatus = async () => {
      try {
        const storedStatus = await AsyncStorage.getItem('@color_status');
        if (storedStatus) {
          setStatus(JSON.parse(storedStatus));
        }
      } catch (error) {
        console.error('Failed to load color status', error);
      }
    };
  
    loadColorStatus();
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
        //
        error = "โปรดป้อนตัวเลข";
      } else if (field === "Price" && Number(value) <= 0) {
        error = "0";
      }
    }
    setErrors((preErrors) => ({ ...preErrors, [field]: error }));
    return error;
  };

  const addproduct = async () => {
    const ProductnameError = validateField("Productname", Productname);
    const PriceError = validateField("Price", Price);
    let updatedProducts;
    if (!ProductnameError && !PriceError) {
      setErrors({ Productname: "", Price: "" });
      

      if (editId) {
        // อัปเดตสินค้าเดิม

        updatedProducts = Products.map((item) =>
          item.id === editId ? { ...item, Productname, Price: Number(Price) } : item
        );
      } else {
        const newIndex = Products.length + 1;
        const newCard = {
          id: Date.now().toString(),
          newIndex,
          Productname,
          Price:Number(Price),
        };
        updatedProducts = [newCard, ...Products];
      }

      try {
        if (!updatedProducts || updatedProducts.length === 0) {
          throw new Error("Data is empty or null"); // ป้องกันการบันทึกค่าที่ว่าง
        }

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedProducts)
        );
        setProducts(updatedProducts); // อัพเดตสถานะของ Products
        setFilteredProducts(updatedProducts); //อัพเดตสถานะของ FilterdProducts
        setIsVisible(false); // ปิด Modal หลังจากบันทึก
        setEditId(null); // รีเซ็ตค่า
        setProductname("");
        setPrice("");
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else if (Price < 0) {
      setErrors({ Price: "โปรดป้อนตัวเลขที่มีค่าเป็นบวก" });
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
  
  const ClearAll = async () =>{
    try {
      let StoredProducts = await AsyncStorage.getItem(STORAGE_KEY); // ดึงสินค้าทั้งหมด
      let products = StoredProducts ? JSON.parse(StoredProducts) : [];

      await AsyncStorage.removeItem(STORAGE_KEY, JSON.stringify()); // บันทึกค่าที่อัปเดตใหม่
      setProducts([]);
      setFilteredProducts([]);

      console.log("ลบสินค้าทั้งหมดสำเร็จ:");
    } catch (error) {
      console.log("Error removing product", error);
    }
  }

  const editProduct = (product) => {
    setProductname(product.Productname);
    setPrice(product.Price.toString()); // แปลงเป็น String เพื่อใช้ใน TextInput
    setEditId(product.id); // บันทึก ID ของสินค้าที่ต้องแก้ไข
    setIsVisible(true); // ทำให้ Modal แสดงขึ้น
  };

  const handleBuy = async (id) => {
    setStatus((prevColors) => {
      // ตรวจสอบว่า prevColors[id] มีค่าอะไร
      const updatedStatus =  {
        ...prevColors,
        [id]: "#bcda60", // ตั้งค่าสีใหม่ให้กับ ID
      };
      console.log("prevColors ก่อนอัปเดต:", prevColors);
      AsyncStorage.setItem('@color_status' , JSON.stringify(updatedStatus));
      return updatedStatus;
    });
  };
  return (
    <View style={styles.ViewStyle}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.Title}>จัดการรายการสินค้า</Text>
      </View>

      <TextInput
        style={styles.Search}
        placeholder="Search by Name"
        value={searchKey}
        onChangeText={setSearchKey}
      />

      {/* <View style={styles.NavContainer}></View> */}

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
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity style={styles.Button} onPress={addproduct}>
                  <Text style={styles.ButtonText}>CONFIRM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.Button}
                  onPress={() => {
                    setIsVisible(false);
                    setProductname("")
                    setPrice("")
                  }}
                >
                  {/*<Text style={styles.OkButtonText}>คลิ้กเพื่อเข้าสู่ Isekai!!!</Text>*/}
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
            //<TouchableOpacity onPress={() => removeProduct(item.id)}></TouchableOpacity>
            <Card
              Productname={`Product ${item.newIndex}:  ${item.Productname}`}
              Price={item.Price}
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
          onPress={() => ClearAll()}
          backgroundColor="#c0004e"
          color="white"
        />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginLeft: 25,
          marginBottom: 15,
        }}
      >{`ผลรวมราคาของสินค้า : `}</Text>
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
    top: 2.5
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
    elevation: 20, //เงาด้านหลัง
  },

  Addproductbutton: {
    fontWeight: "bold",
  },
});

export default homescreen;
