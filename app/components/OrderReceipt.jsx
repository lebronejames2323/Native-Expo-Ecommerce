import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { imageUrl1 } from '../api/configuration';
import { index } from '../api/auth';

const OrderReceipt = ({ order, onClose }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const refreshUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await index(token);
        setUser(res?.data || null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const calculateTotal = () => {
    return order.products.reduce(
      (total, product) =>
        total + Number(product.price) * product.pivot.quantity,
      0
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <FontAwesome name="check-circle" size={32} color="#32a852" />
            </View>
          </View>
          <Text style={styles.title}>Thank You for Your Order!</Text>
          <Text style={styles.subtitle}>
            Your order has been received and is now being processed
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date of Order</Text>
              <Text style={styles.infoValue}>
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>Cash on Delivery</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.deliveryBox}>
              <View style={styles.deliveryRow}>
                <FontAwesome name="map-marker" size={20} color="#32a852" />
                <View style={styles.deliveryTextContainer}>
                  <Text style={styles.smallText}>Delivery Address</Text>
                  <Text style={styles.mediumText}>
                    {user?.profile?.address}
                  </Text>
                </View>
              </View>
              <View style={styles.deliveryRow}>
                <FontAwesome name="phone" size={20} color="#32a852" />
                <View style={styles.deliveryTextContainer}>
                  <Text style={styles.smallText}>Contact Number</Text>
                  <Text style={styles.mediumText}>
                    {user?.profile?.phone_number}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <ScrollView style={styles.orderItemsContainer}>
              {order.products.map(product => (
                <View key={product.id} style={styles.orderItem}>
                  <Image
                    source={{ uri: `${imageUrl1}/${product.id}.${product.extension}` }}
                    style={styles.orderItemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{product.name}</Text>
                    <Text style={styles.smallText}>Quantity: {product.pivot.quantity}</Text>
                  </View>
                  <View style={styles.orderItemPriceContainer}>
                    <Text style={styles.orderItemPrice}>
                      ₱{Number(product.price).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₱{calculateTotal().toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.ordersButton]}
              onPress={() => router.push('/(tabs)/about')}
            >
              <Text style={styles.buttonText}>Go to Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.closeButtonText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    minHeight: 350,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#32a852',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  body: {
    padding: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    flexBasis: '48%',
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 10,
    color: 'gray',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  deliveryBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 10,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  deliveryTextContainer: {
    marginLeft: 6,
  },
  smallText: {
    fontSize: 10,
    color: 'gray',
  },
  mediumText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderItemsContainer: {
    maxHeight: 80,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    padding: 6,
    borderRadius: 10,
    marginBottom: 6,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 6,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  orderItemPriceContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32a852',
  },
  totalContainer: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#32a852',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  ordersButton: {
    backgroundColor: '#32a852',
  },
  closeButton: {
    backgroundColor: '#f3f3f3',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  closeButtonText: {
    color: '#333',
  },
});

export default OrderReceipt;
