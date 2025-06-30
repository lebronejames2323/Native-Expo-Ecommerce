import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import deal from '../images/deal-bg.jpg';

const Banner = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={deal} style={styles.banner}>
                <Text style={styles.title}>Daily Tech Deals</Text>
                <Text style={styles.subtitle}>Build Your Custom Rig</Text>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    banner: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 50,
    },
});

export default Banner;