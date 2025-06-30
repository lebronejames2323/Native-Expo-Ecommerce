import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import gallery1 from '../images/pcc1.jpg';
import gallery2 from '../images/insta-3.jpg';
import gallery3 from '../images/pcc2.jpg';
import gallery4 from '../images/insta-4.jpg';
import gallery5 from '../images/insta-5.jpg';
import gallery6 from '../images/pcc3.jpg';

const galleryImages = [
    { id: '1', source: gallery1 },
    { id: '2', source: gallery2 },
    { id: '3', source: gallery3 },
    { id: '4', source: gallery4 },
    { id: '5', source: gallery5 },
    { id: '6', source: gallery6 },
];

const Gallery = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={galleryImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Image source={item.source} style={styles.image} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        margin: 10,
    },
});

export default Gallery;
