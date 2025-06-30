import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import payment from '../images/payment.png'
import shipping from '../images/shipping1.jpg'
import refund from '../images/return.png'
import gift from '../images/gift.png'

const serviceData = [
    { image: shipping, title: 'Nationwide Shipping', description: 'Enjoy seamless shopping at home.' },
    { image: payment, title: '100% Secure Payment', description: 'Shop safely and confidently.' },
    { image: refund, title: 'Fast & Reliable Delivery', description: 'Experience dependable service.' },
    { image: gift, title: 'Hassle-Free Returns', description: 'Easy and stress-free returns.' },
];

const Services = () => {
    return (
        <View style={styles.container}>
            {serviceData.map((service, index) => (
                <View key={index} style={styles.card}>
                    <Image source={service.image} style={styles.image} />
                    <Text style={styles.title}>{service.title}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    card: {
        width: '48%',
        alignItems: 'center',
        marginVertical: 20
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
    },
});

export default Services;