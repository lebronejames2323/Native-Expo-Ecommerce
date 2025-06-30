import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { imageUrl2 } from '../api/configuration';
import { getCategories } from '../api/product';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refreshCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res?.data ?? []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    router.push(`/categories/${categoryName}`);
  };

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>Category List</Text>
      </View>

      <View style={styles.rightSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#32a852" />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.slider}
          >
            {categories.map((category) => (
              <Pressable 
                key={category.id} 
                style={styles.categoryItem} 
                onPress={() => handleCategoryClick(category.name)}
              >
                <Image 
                  source={{ uri: `${imageUrl2}/${category.id}.${category.extension}` }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F3',
    paddingTop: 130,
    paddingBottom: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  leftSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#32a852',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  rightSection: {
    width: '100%',
  },
  slider: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  categoryItem: {
    marginHorizontal: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Category;