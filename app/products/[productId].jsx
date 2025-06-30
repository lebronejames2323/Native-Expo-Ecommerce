import React, { useState, useEffect } from 'react';
import { url } from "../api/configuration";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getSpecificProduct } from '../api/product';
import { imageUrl1 } from '../api/configuration';

const ProductPage = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);


  const refreshProducts = () => {
    setLoading(true);
    getSpecificProduct(productId)
      .then((res) => {
        setProducts(res?.data ? [res.data] : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setProducts([]);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    refreshProducts();
  }, [productId]);


  const handleCartClick = () => {
    router.push('/cart');
  };

  const addToCart = async (prodId, productPrice) => {
    try {
      console.log("Starting addToCart...");
      setSelectedVariation(null);

      const token = await AsyncStorage.getItem('token');
      console.log("Token:", token);
      if (!token || token === "undefined" || token.trim() === "") {
        Alert.alert('You are not logged in.');
        return;
      }

      setLoading2(true);

      const response = await fetch(`${url}/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Cart fetch response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Cart fetch error response:", errorData);
        throw new Error(errorData.message || 'Failed to fetch cart');
      }

      const res = await response.json();
      console.log("Cart data:", res);
      const carts = res?.data;

      const isProductInCart = carts.some((cart) =>
        cart.products.some((product) => product.id === prodId)
      );
      console.log("Is product in cart:", isProductInCart);

      if (isProductInCart) {
        Alert.alert('Error', 'This product is already in the cart!');
        return;
      }

      if (!productPrice || isNaN(productPrice)) {
        console.log("Invalid product price:", productPrice);
        Alert.alert('Error', 'Invalid product price.');
        return;
      }

      const requestBody = {
        products: [
          {
            id: prodId,
            quantity: 1,
            price: productPrice,
            variation_id: null,
          },
        ],
      };

      console.log("Request payload:", requestBody);

      const addResponse = await fetch(`${url}/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Add to cart response status:", addResponse.status);

      const addResponseData = await addResponse.json();
      console.log("Add to cart response body:", addResponseData);

      if (addResponse.ok) {
        refreshProducts();
        Alert.alert('Success', 'Product added to cart successfully!');
      } else {
        Alert.alert('Error', addResponseData.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message || error);
      Alert.alert('Error', 'An error occurred.');
    } finally {
      setLoading2(false);
    }
  };

  const addToWishlist = async (prodId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || token === "undefined" || token.trim() === "") {
        Alert.alert('You are not logged in.');
        return;
      }
  
      setLoading2(true);
      const response = await fetch(`${url}/wishlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch wishlist');
      }
  
      const res = await response.json();
      const carts = res?.data;
  
      const isProductInWishlist = carts.some((cart) =>
        cart.products.some((product) => product.id === prodId)
      );
      if (isProductInWishlist) {
        Alert.alert('Error', 'This product is already in the wishlist!');
        return;
      }
  
      const addResponse = await fetch(`${url}/wishlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: [{ id: prodId, quantity: 1 }],
        }),
      });
  
      if (addResponse.ok) {
        refreshProducts();
        Alert.alert('Success', 'Product added to wishlist successfully!');
      } else {
        Alert.alert('Error', 'Failed to add product to wishlist.');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error.message || error);
      Alert.alert('Error', 'An error occurred.');
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
        <TouchableOpacity onPress={() => router.push('/')} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#32a852" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Info</Text>
        <TouchableOpacity onPress={handleCartClick} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Cart</Text>
          <FontAwesome name="shopping-cart" size={22} color="#32a852" />
        </TouchableOpacity>
      </View>

      <View style={styles.productContainer}>
        {products.map((product) => (
          <View key={product.id} style={styles.productWrapper}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
                style={styles.productImage}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.categoryText}>{product.category?.name}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
              <Text style={styles.priceText}>
                ₱{Number(product.price).toLocaleString()}
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.cartButton, loading2 && { opacity: 0.5 }]}
                  onPress={() => addToCart(product.id, product.price)}
                  disabled={loading2}
                >
                  <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.wishlistButton, loading2 && { opacity: 0.5 }]}
                  onPress={() => addToWishlist(product.id)}
                  disabled={loading2}
                >
                  <Text style={styles.wishlistButtonText}>Add to Wishlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
    backgroundColor: '#FFFFFF',
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
    fontSize: 16,
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
  productContainer: {
    padding: 20,
    marginTop: 80,
  },
  productWrapper: {
    display: 'flex',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center'
  },
  priceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#32a852',
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cartButton: {
    backgroundColor: '#32a852',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 6,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  wishlistButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 6,
  },
  wishlistButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
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
});

export default ProductPage;