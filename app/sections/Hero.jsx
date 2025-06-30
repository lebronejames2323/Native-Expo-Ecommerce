import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Pressable, StyleSheet } from 'react-native';
import pccase from '../images/pccase.jpg';
import motherboard from '../images/motherboard.jpg';
import gpu from '../images/gpu.jpg';
import ryzen from '../images/ryzen5.jpg';

const images = [
  { src: gpu, title: 'SAPPHIRE RX 6600', button: 'CASH ON DELIVERY' },
  { src: motherboard, title: 'MSI MAG B650', button: 'FREE SHIPPING' },
  { src: pccase, title: 'ENERMAX PC CASE', button: 'LIMITED STOCKS' },
  { src: ryzen, title: 'RYZEN 5600', button: 'EXCLUSIVE DEAL' }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.hero}>
    {images.map((item, index) => (
    index === currentIndex && (
        <ImageBackground key={index} source={item.src} style={styles.slide}>
        <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>100% trusted <Text style={styles.highlight}>PC Parts</Text></Text>
            <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{item.button}</Text>
            </Pressable>
        </View>
        </ImageBackground>
    )
    ))}

    </View>
  );
};

const styles = StyleSheet.create({
hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
},
slide: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
},
image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
},
active: {
    opacity: 1
},
overlay: {
    paddingVertical: 50,
    right: 90,
    gap: 6,
},
title: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
},
subtitle: {
    color: 'white',
    fontSize: 12
},
highlight: {
    color: '#FFD700',
    fontWeight: 'bold'
},
button: {
    backgroundColor: '#FFD700',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
},
    buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 10
}

});

export default Hero;