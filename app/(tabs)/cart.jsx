import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { imageUrl1 } from '../api/configuration';
import { fetchCarts } from '../api/product';
import { MaterialIcons } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import OrderReceipt from '../components/OrderReceipt';
import { url } from "../api/configuration";

const CartPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const refreshCarts = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setCarts([]);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchCarts(token)
      .then((res) => {
        setCarts(res?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCarts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshCarts();
  }, []);

const placeOrder = async () => {
  Alert.alert("Confirm Order", "Are you sure you want to place order?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Confirm",
      onPress: async () => {
        try {
          setLoading2(true);

          const token = await AsyncStorage.getItem("token");

          if (!token) {
            Alert.alert("Error", "User is not logged in!");
            setLoading2(false);
            return;
          }

          const products = carts
            .flatMap((cart) => cart.products || [])
            .map((product) => ({
              id: product.id,
              quantity: product.pivot.quantity,
            }));

          const orderPayload = {
            products,
            delivery_address: "Earth",
            payment_method: "Cash on Delivery",
            full_name: "Admin Istrator",
            phone_number: "09584357657",
          };

          console.log("Final Order Payload:", orderPayload);

          const response = await fetch(`${url}/orders`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to place order");
          }

          const res = await response.json();
          setLastOrder(res.data);
          Alert.alert("Success", "Order placed successfully");

          for (const cart of carts) {
            console.log(`Deleting cart with ID: ${cart.id}`);
            const deleteResponse = await fetch(`${url}/carts/${cart.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!deleteResponse.ok) {
              const deleteError = await deleteResponse.json();
              console.error(
                `Failed to delete cart with ID ${cart.id}:`,
                deleteError.message
              );
              throw new Error(`Failed to delete cart with ID ${cart.id}`);
            }
          }

          setCarts([]);
        } catch (err) {
          console.error("Error placing order or deleting carts:", err.message);
          Alert.alert("Error", err.message || "Your cart is empty");
        } finally {
          setLoading2(false);
          setShowReceipt(true);
        }
      },
    },
  ]);
};


  const updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User is not authenticated!');
        return;
      }
      const response = await fetch(
        `${url}/carts/${cartId}/update-product`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        refreshCarts();
      } else {
        console.error(data.message);
        Alert.alert('Error', 'Failed to update product quantity.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating the product quantity.');
    }
  };

  const deleteProductFromCart = async (cartId, productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User is not authenticated!');
        return;
      }
      const response = await fetch(
        `${url}/carts/${cartId}/delete-product`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Product deleted successfully!');
        refreshCarts();
      } else {
        console.error(data.message);
        Alert.alert('Error', 'Failed to delete product from cart.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while deleting the product.');
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#32a852" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1, backgroundColor: '#F9F9F971' }}>
      <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push('/')}
            style={styles.headerButton}
          >
            <MaterialIcons name="arrow-back" size={22} color="#32a852" />
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity 
            style={styles.nothing}
          >
            <Text style={{ width: 50 }}></Text>
          </TouchableOpacity>
        </View>

      {isLoggedIn ? (
        <View style={styles.cartContainer}>
          {carts.length > 0 ? (
            carts.map((cart) => (
              <View key={cart.id} style={{ paddingVertical: 10, backgroundColor: "#fff" }}>
                <>
                {cart.products.map((product) => (
                <ReanimatedSwipeable
                  key={product.id}
                  renderRightActions={() => (
                    <TouchableOpacity
                      onPress={() => deleteProductFromCart(cart.id, product.id)}
                      style={{
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 80,
                        margin: 11,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      paddingHorizontal: 3,
                      alignItems: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    <Image
                      source={{
                        uri: `${imageUrl1}/${product.id}.${product.extension}`,
                      }}
                      style={{ width: 60, height: 60, borderRadius: 5 }}
                    />

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {product.name}
                      </Text>
                      <Text style={{ color: '#999' }}>
                        ₱{Number(product.price).toLocaleString()}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            updateProductQuantity(
                              cart.id,
                              product.id,
                              Math.max(1, product.pivot.quantity - 1)
                            )
                          }
                          style={{
                            paddingVertical: 2,
                            paddingHorizontal: 6,
                            borderWidth: 0.7,
                            borderColor: '#A9A9A9',
                            borderTopLeftRadius: 3,
                            borderBottomLeftRadius: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 12 }}>-</Text>
                        </TouchableOpacity>

                        <View
                          style={{
                            paddingVertical: 2,
                            paddingHorizontal: 8,
                            borderTopWidth: 0.7,
                            borderBottomWidth: 0.7,
                            borderColor: '#A9A9A9',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 12 }}>{product.pivot.quantity}</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            updateProductQuantity(
                              cart.id,
                              product.id,
                              product.pivot.quantity + 1
                            )
                          }
                          style={{
                            paddingVertical: 2,
                            paddingHorizontal: 6,
                            borderWidth: 0.7,
                            borderColor: '#A9A9A9',
                            borderTopRightRadius: 3,
                            borderBottomRightRadius: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 12 }}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ReanimatedSwipeable>
              ))}
              </>
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Your cart is empty
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: '#00aaff', fontWeight: 'bold' }}>
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              padding: 20,
              backgroundColor: '#fff',
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Order Summary
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text>Total Items:</Text>
              <Text>
                {carts.reduce(
                  (total, cart) =>
                    total +
                    cart.products.reduce(
                      (subtotal, product) => subtotal + product.pivot.quantity,
                      0
                    ),
                  0
                )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text>Shipping:</Text>
              <Text>Free</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text>Total:</Text>
              <Text style={{ fontWeight: 'bold', color: '#32a852' }}>
                ₱
                {carts
                  .flatMap((cart) => cart.products)
                  .reduce(
                    (total, product) =>
                      total + product.price * product.pivot.quantity,
                    0
                  )
                  .toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={placeOrder}
              disabled={loading2}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: '#32a852',
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                {loading2 ? 'Processing...' : 'Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You are not logged in.</Text>
        </View>
      )}
    </ScrollView>

    {showReceipt && lastOrder && <OrderReceipt order={lastOrder} onClose={closeReceipt} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#444',
  },
  header: {
    width: '100%',
    height: 65,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#32a852',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  nothing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartContainer: {
    paddingTop: 85, 
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    paddingTop: 120, 
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },
});


export default CartPage;
