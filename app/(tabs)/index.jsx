import React, { useState, useEffect, useRef  } from 'react';
import { url } from "../api/configuration";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, FlatList, TextInput, SafeAreaView, Pressable, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons"
import { imageUrl1 } from '../api/configuration';
import { featuredProducts } from '../api/product';
import { logout } from '../api/auth';
import { router } from 'expo-router';
import Category from "../sections/category";
import Hero from "../sections/Hero";
import Banner from "../sections/Banner";
import Services from "../sections/Services";
import Gallery from "../sections/Gallery";

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef(null);

  const refreshProducts = async () => {
    try {
      const res = await featuredProducts();
      setProducts(res?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products');
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (query.length > 1) {
      searchDebounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await fetch(`${url}/products`, {
            method: 'GET',
          });

          if (!response.ok) {
            throw new Error('Failed to search products');
          }

          const data = await response.json();
          const filteredProducts = data.data.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );

          setSearchResults(filteredProducts);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              if (token) {
                const res = await logout(token);

                if (res?.ok) {
                  await AsyncStorage.removeItem("token");
                  setHasToken(false);
                  router.push("/login");
                  Alert.alert("Logged out successfully.");
                } else {
                  console.error(res?.message ?? "Something went wrong during logout!");
                }
              } else {
                console.error("No token found!");
              }
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const handleClickProduct = (productId) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const handleWishlistClick = () => {
    router.push('/wishlist');
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={(text) => handleSearch(text)}
            />
            {isSearching ? (
              <ActivityIndicator size="small" color="#008000" />
            ) : (
              <TouchableOpacity
                onPress={() => handleSearch(searchQuery)}
                style={styles.searchButton}
              >
                <MaterialIcon name="magnify" size={26} color="#32a852" />
              </TouchableOpacity>
            )}
          </View>

          <Pressable
            style={styles.headerButtonContainer}
          >
            <MaterialIcon onPress={handleWishlistClick} name="cards-heart-outline" size={26} color="#32a852" />
            {hasToken ? (
            <MaterialIcons onPress={handleLogout} name="logout" size={25} color="#32a852" />
            ) : (
            <MaterialIcon onPress={() => router.push("/login")} name="account-circle-outline" size={27} color="#32a852" />
            )}
          </Pressable>

        </View>
      </SafeAreaView>

      {showSearchResults && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleClickProduct(item.id)}
                style={styles.searchResultItem}
              >
                <Image
                  source={{
                  uri: `${imageUrl1}/${item.id}.${item.extension}`,
                }}
                  style={styles.searchResultImage}
                />
                <View>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={{ color: 'green' }}>
                    ₱{Number(item.price).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {searchQuery.length > 1
                  ? 'No products found'
                  : 'Type at least 2 characters to search'}
              </Text>
            }
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>

        <Hero />

        <Category />

        <Services />

        <Gallery />

        <View style={styles.productsContainer}>

          <View style={styles.productTitleContainer}>
            <Text style={styles.browseText}>Browse Collections</Text>
            <Text style={styles.featuredText}>Featured Products</Text>
          </View>

          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductClick(product.id)}
            >
              <Image
                source={{
                  uri: `${imageUrl1}/${product.id}.${product.extension}`,
                }}
                style={styles.productImage}
              />
              <Text style={styles.categoryText}>{product.category?.name}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                ₱{Number(product.price).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View> 

        {loading && <ActivityIndicator size="large" color="#32a852" />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 12,
    elevation: 2,
    width: '80%',
    maxWidth: 245,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    color: '#333',
  },
  searchButton: {
    padding: 5,
    borderRadius: 8,
    marginLeft: 7,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  headerButton1: {
    gap: 13,
  },
  headerButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 55,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    zIndex: 40,
    borderRadius: 8,
    maxHeight: 213,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  searchResultName: {
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 5,
    backgroundColor: '#f3f3f3',
    gap: 40
  },
  productTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  browseText: {
    color: '#32a852',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuredText: {
    color: 'black',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginVertical: 12,
  },
  categoryText: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 4,
    textAlign: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32a852',
    textAlign: 'center',
    marginVertical: 5,
  },
  viewMoreButton: {
    backgroundColor: '#32a852',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
  },
  viewMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default ProductsGrid;
