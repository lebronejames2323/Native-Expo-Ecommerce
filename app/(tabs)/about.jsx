import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { imageUrl1 } from '../api/configuration';
import { index, logout } from '../api/auth';
import { fetchOrders } from '../api/product';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await fetchOrders(token);
        setOrders(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Error fetching orders");
    }
    setLoading(false);
  };
  useEffect(() => {
    refreshOrders();
  }, []);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await index(token);
        setUser(res?.data || null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      Alert.alert("Error", "Error fetching user data");
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const res = await logout(token);

        if (res?.ok) {
          await AsyncStorage.removeItem("token");

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
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a852" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>You are not logged in.</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: '#32a852',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}
          onPress={() => router.push('/login')}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const calculateOrderTotal = (order) => {
    return order.products.reduce(
      (total, product) => total + Number(product.price) * product.pivot.quantity,
      0
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userSection}>

        <View style={styles.accountOverview}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewHeaderText}>Account Overview</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{user.profile.first_name} {user.profile.last_name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Username:</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user.profile.phone_number}</Text>
            </View>
            <View style={[styles.infoItem, { width: '100%' }]}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{user.profile.address}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.orderSection}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderHeaderText}>Order Details</Text>
        </View>
        <View style={styles.ordersContainer}>
          {orders.length > 0 ? (
            orders.map(order => {
              const orderTotal = calculateOrderTotal(order);
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderSummary}>
                    <Text style={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.orderTotal}>Total: ₱{orderTotal.toLocaleString()}</Text>
                  </View>
                  {order.products.map(product => (
                    <View key={`${order.id}-${product.id}`} style={styles.productCard}>
                      <View style={styles.productImageContainer}>
                        <Image
                          source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
                          style={styles.productImage}
                        />
                      </View>
                      <View style={styles.productDetails}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.orderStatusText}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesome name="circle" size={9} color="#32a852" style={{ marginRight: 3}}/>
                            <Text >{order.order_status}</Text>
                          </View>
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
                          <Text style={styles.productPrice}>
                            ₱{(product.price * product.pivot.quantity).toLocaleString()}
                          </Text>
                          <Text style={styles.orderProductId}>x{product.pivot.quantity}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyOrdersContainer}>
              <Text style={styles.emptyOrdersText}>
                No orders yet for your account.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F971',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#444',
  },
  userSection: {
    paddingTop: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileCard: {
    width: 450,
    height: 309,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  profileUsername: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center'
  },
  profileEmail: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center'
  },
  editButton: {
    backgroundColor: '#32a852',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  accountOverview: {
    flex: 1,
    marginVertical: 10,
  },
  overviewHeader: {
    backgroundColor: '#32a852',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  overviewHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoGrid: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#4A4A4A',
    fontSize: 14,
  },
  infoValue: {
    color: '#666',
    fontSize: 14,
  },
  orderSection: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  orderHeader: {
    backgroundColor: '#32a852',
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  orderHeaderText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  ordersContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 15,
  },
  orderCard: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#A9A9A9"
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: "#A9A9A9",
    padding: 10,
    marginVertical: 5,
  },
  productImageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderProductDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  orderProductId: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIcon: {
    marginRight: 5,
  },
  orderStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
  },
  productTotals: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  productQuantity: {
    fontSize: 14,
    color: 'gray',
  },
  productPrice: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '600',
    color: '#32a852',
  },
  emptyOrdersContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: '#666',
  },
  button:{
    width: 80,
    height: 40,
    backgroundColor: "#0096FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 8
  },
  emptyText: {
    fontSize: 16,
    color: '#444',
  },
  logoutButton: {
  backgroundColor: 'red',
  padding: 5,
  borderRadius: 5,
  width: '30%',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginBottom: 20,
},
logoutText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
}
});

export default AccountPage;