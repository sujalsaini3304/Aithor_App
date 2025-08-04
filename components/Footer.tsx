import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';

const Footer = () => {
  return (
    <>
      <View style={styles.footerContainer}>
        <Divider />
        <Text style={[styles.text, { marginTop: 20 }]}>
          v1.0.1 
        </Text>
        <Text style={styles.text}>
          &copy; copyright 2025 – 2050
        </Text>
        <Text style={styles.text}>CEO & Developer of Aithor -</Text>
        <Text style={styles.text}>Sujal Kumar Saini</Text>
        <Text style={styles.text}>📧 sujalsaini3304@gmail.com</Text>
      </View>
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 40,
    marginBottom: 20,
    backgroundColor:"#ffffff"
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#808080',
    marginTop: 5,
  },
});
