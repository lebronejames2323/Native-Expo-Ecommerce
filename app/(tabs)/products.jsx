import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { imageUrl1 } from '../api/configuration';
import { index as fetchProducts } from '../api/product';
import { router } from 'expo-router';

const ProductsGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(16);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  

  const fetchNextPage = async () => {
    if (pagination.current_page >= pagination.last_page) return;

    try {
      setLoading(true);
      const nextPage = pagination.current_page + 1;
      const res = await fetchProducts(nextPage);

      setProducts(prev => [...prev, ...(res?.data || [])]);
      setPagination(res?.pagination || pagination);
    } catch (error) {
      console.error('Error fetching next page:', error);
      Alert.alert('Error', 'Could not load more products');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts(1);
      setProducts(res?.data || []);
      setPagination(res?.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleViewMoreClick = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleProducts(products.length);
    } else {
      setVisibleProducts(16);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={styles.headerButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="#32a852" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity 
          onPress={handleCartClick}
          style={styles.headerCartButton}
        >
          <Text style={styles.headerButtonText}>Cart</Text>
          <FontAwesome name="shopping-cart" size={20} color="#32a852" />
        </TouchableOpacity>
      </View>

      <View style={styles.productsContainer}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={`${product.id}-${index}`}
            style={styles.productCard}
            onPress={() => handleProductClick(product.id)}
          >
            <Image 
              source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
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
      
      <TouchableOpacity 
        style={styles.viewMoreButton} 
        onPress={fetchNextPage}
        disabled={loading || pagination.current_page >= pagination.last_page}
      >
        <Text style={styles.viewMoreButtonText}>
          {loading ? "Loading..." : pagination.current_page < pagination.last_page ? "LOAD MORE" : "NO MORE PRODUCTS"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
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
  productsContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 15
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    width: '48%',
    position: 'relative',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  iconButton: {
    backgroundColor: '#32a852',
    padding: 8,
    borderRadius: 20,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginVertical: 12,
  },
  categoryText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
    textAlign: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32a852',
    textAlign: 'center',
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 8,
  },
  reviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  saleButton: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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