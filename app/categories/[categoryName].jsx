import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getCategories } from '../api/product';
import { imageUrl1 } from '../api/configuration';

const CategoryPage = () => {
  const { categoryName } = useLocalSearchParams();
  const router = useRouter();
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const refreshCategory = async () => {
    setLoading(true);
    const res = await getCategories(categoryName);
    setCategory(res?.data?.find((cat) => cat.name === categoryName));
    setLoading(false);
  };

  useEffect(() => {
    refreshCategory();
  }, [categoryName]);

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
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#32a852" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity onPress={handleCartClick} style={styles.headerRight}>
          <Text style={styles.headerRightText}>Cart</Text>
          <FontAwesome name="shopping-cart" size={22} color="#32a852" />
        </TouchableOpacity>
      </View>

      <View style={styles.productGrid}>
        {category?.products?.map(product => (
          <View key={product.id} style={styles.productCard}>
            
            <TouchableOpacity onPress={() => handleProductClick(product.id)} style={styles.productContent}>
              <Image 
                source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                ₱{Number(product.price).toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightText: {
    color: '#32a852',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  productGrid: {
    marginTop: 80,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: '#32a852',
    padding: 8,
    borderRadius: 20,
  },
  productContent: {
    padding: 15,
    paddingTop: 20,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32a852',
    textAlign: 'center',
    marginVertical: 4,
  },
});

export default CategoryPage;
