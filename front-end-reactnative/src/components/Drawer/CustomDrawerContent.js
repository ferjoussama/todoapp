import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../assets/icons/logo_black.png';

const CustomDrawerContent = ({navigation}) => {
  const apiLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          await AsyncStorage.removeItem('userToken');
        } else {
          console.error('Logout failed with status:', response.status);
        }
      } else {
        console.error('userToken token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <DrawerContentScrollView>
      <Image
        source={Logo}
        style={{
          width: 60,
          height: 60,
          marginBottom: 20,
          marginTop: 20,
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
      />
      <TouchableOpacity onPress={handleLogout}>
        <View style={{padding: 16}}>
          <Text style={{fontWeight: 600, color: 'black',textAlign:'center'}}>Logout</Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
