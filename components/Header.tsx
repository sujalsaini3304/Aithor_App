import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';

const Header = ({ mb }) => {
  return (
    <>
      <View style={{backgroundColor:"#ffffff"}}>
        <View
          style={{
            height: 60,
            gap: 10,
          }}
        >
          <Image
            source={require('../public/logo.png')}
            style={{ height: 60, width: 60 }}
          />
        </View>
        <Divider
          style={{
            marginTop: 10,
            marginBottom: mb,
          }}
        />
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({});
