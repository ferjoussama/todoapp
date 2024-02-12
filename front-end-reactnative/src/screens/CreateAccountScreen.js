import React, {useState, useEffect} from 'react';
import * as Yup from 'yup';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundImage from '../assets/Backgrounds/createAccountbg.png';
import LogoImage from '../assets/icons/logo_white.png';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateButton from '../components/Buttons/Create';
import CancelButton from '../components/Buttons/Cancel';

const CreateAccountScreen = ({navigation}) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisibleConfirm, setIsPasswordVisibleConfirm] = useState(
    false,
  );
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('First Name is required')
      .max(250, 'First Name must be at most 250 characters'),
    lastname: Yup.string()
      .required('Last Name is required')
      .max(250, 'Last Name must be at most 250 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format')
      .max(250, 'Email must be at most 250 characters'),

    phone: Yup.string()
      .required('Phone Number is required')
      .max(11, 'Phone Number must be at most 11 characters')
      .min(8, 'Phone Number must be at minimum 8 characters'),
    confirmPassword: Yup.string()
      .required('Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const CreateAccountRequest = async () => {
    try {
      setLoading(true);
      await validationSchema.validate(
        {firstname, lastname, phone, email, password, confirmPassword},
        {abortEarly: false},
      );
      const response = await fetch(`${process.env.ENDPOINT_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          phone,
          email,
          password,
        }),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating account');
      }

      const responseData = await response.json();

      const userToken = responseData.data.token;
      await AsyncStorage.setItem('userToken', userToken);
      navigation.navigate('ToDo');
    } catch (error) {
      if (error.errors != undefined) {
        Toast.show({
          type: 'error',
          text1: error.errors.join('\n'),
          position: 'top',
        });
      } else {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Email address already exist !',
          position: 'top',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const togglePasswordVisibilityConfirm = () => {
    setIsPasswordVisibleConfirm(prev => !prev);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView vertical style={styles.container}>
        {!isKeyboardOpen && (
          <ImageBackground source={BackgroundImage} style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={LogoImage} style={styles.logo} />
              <Text style={styles.headerText}>CREATE AN ACCOUNT </Text>
            </View>
            <Icon
              style={{position: 'absolute', right: 20, top: 40}}
              name="arrow-left"
              size={25}
              color="white"
              onPress={() => navigation.goBack()}
            />
          </ImageBackground>
        )}
        <View style={{padding: 20, justifyContent: 'center'}}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstname}
              onChangeText={text => setFirstName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastname}
              onChangeText={text => setLastName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <Icon
                name={isPasswordVisible ? 'eye' : 'eye-slash'}
                size={20}
                color="#333"
                style={styles.eyeicon}
                onPress={togglePasswordVisibility}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                secureTextEntry={!isPasswordVisibleConfirm}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
              />
              <Icon
                name={isPasswordVisibleConfirm ? 'eye' : 'eye-slash'}
                size={20}
                color="#333"
                style={styles.eyeicon}
                onPress={togglePasswordVisibilityConfirm}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <CancelButton onPress={() => navigation.goBack()} />
            <CreateButton onPress={CreateAccountRequest} loading={loading} name="Create" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  passwordInputContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    borderRadius: 5,
    padding: 12,
  },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 20,
  },
  eyeicon: {
    marginRight: 10,
  },
});

export default CreateAccountScreen;
