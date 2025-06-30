import React, { useState, useEffect } from 'react';
import { url } from "./api/configuration";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { imageUrl1 } from './api/configuration';
import { fetchWishlists } from './api/product';

const WishlistPage = () => {
  const router = useRouter();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const refreshWishlists = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setWishlists([]);
        setLoading(false);
        return;
      }
      setIsLoggedIn(true);
      const res = await fetchWishlists(token);
      setWishlists(res?.data || []);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      Alert.alert("Error", "Error fetching wishlist");
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshWishlists();
  }, []);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const addToCart = async (product) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token || token === "undefined" || token.trim() === "") {
      Alert.alert("Error", "User is not authenticated!");
      return;
    }

    setLoading2(true);
    const response = await fetch(`${url}/carts`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch cart");
    }

    const res = await response.json();
    const carts = res?.data || [];

    const isProductInCart = carts.some(cart =>
      cart.products.some(p => p.id === product.id)
    );

    if (isProductInCart) {
      Alert.alert("Error", "This product is already in the cart!");
      return;
    }

    // Sanity check for price
    if (!product.price || isNaN(product.price)) {
      Alert.alert("Error", "Invalid product price.");
      return;
    }

    const requestPayload = {
      products: [{
        id: product.id,
        quantity: 1,
        price: product.price,
        variation_id: null, // or replace with product.selectedVariation?.id if supported
      }],
    };

    console.log("Request payload:", requestPayload);

    const addResponse = await fetch(`${url}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const addData = await addResponse.json();

    if (addResponse.ok) {
      Alert.alert("Success", "Product added to cart successfully!");
    } else {
      console.error("Add cart error:", addData.message);
      Alert.alert("Error", addData.message || "Failed to add product to cart.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    Alert.alert("Error", error.message || "An error occurred.");
  } finally {
    setLoading2(false);
  }
};


  const deleteProductFromWishlist = async (wishlistId, productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "User is not authenticated!");
        return;
      }
      setLoading2(true);
      const response = await fetch(`${url}/wishlists/${wishlistId}/delete-product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Product deleted successfully!");
        refreshWishlists();
      } else {
        console.error(data.message);
        Alert.alert("Error", "Failed to delete product from wishlist.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while deleting the product.");
    } finally {
      setLoading2(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a852" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={styles.headerButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="#32a852" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity 
          onPress={handleCartClick}
          style={styles.headerCartButton}
        >
          <Text style={styles.headerButtonText}>Cart</Text>
          <FontAwesome name="shopping-cart" size={20} color="#32a852" />
        </TouchableOpacity>
      </View>

      <View style={styles.wishlistContainer}>
      {isLoggedIn ? (
        wishlists.length > 0 ? (
          wishlists.map(wishlist => (
            <View key={wishlist.id} style={styles.wishlistCard}>
              {wishlist.products.map(product => (
                <View key={product.id} style={styles.productRow}>
                  <TouchableOpacity 
                    style={styles.imageContainer}
                    onPress={() => handleProductClick(product.id)}
                  >
                    <Image
                      source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
                      style={styles.productImage}
                    />
                  </TouchableOpacity>
                  <View style={styles.productDetailContainer}>
                    <TouchableOpacity 
                      onPress={() => handleProductClick(product.id)}
                    >
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>
                        Price: ₱{Number(product.price).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity 
                        onPress={() => addToCart(product)}
                        disabled={loading2}
                        style={[styles.cartButton, loading2 && styles.disabledButton]}
                      >
                        <Text style={styles.cartButtonText}>Add to Cart</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => deleteProductFromWishlist(wishlist.id, product.id)}
                        disabled={loading2}
                        style={[styles.deleteButton, loading2 && styles.disabledButton]}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no products in your wishlist...</Text>
          </View>
        )
        ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You are not logged in.</Text>
        </View>
      )}
      </View>
    </ScrollView>
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
  headerCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistContainer: {
    paddingTop: 85, 
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  wishlistCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  imageContainer: {
    width: 120,
    height: 100,
    marginRight: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productDetailContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cartButton: {
    backgroundColor: '#32a852',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },
});

export default WishlistPage;