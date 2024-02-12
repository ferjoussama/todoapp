import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/icons/logo_black.png';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const LoginScreen = ({navigation}) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checktoken, setCheckToken] = useState(true);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate('ToDo');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setCheckToken(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = password => {
    return password.length >= 6;
  };

  const LoginRequest = async () => {
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        position: 'bottom',
      });
      return;
    }

    if (!validatePassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Password should be at least 6 characters',
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.ENDPOINT_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const userToken = responseData.data.token;
        await AsyncStorage.setItem('userToken', userToken);
        navigation.navigate('ToDo');
      } else {
        console.log(response);
        Toast.show({
          type: 'error',
          text1: 'Invalid credentials',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Invalid credentials',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const CreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  if (checktoken) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={text => setemail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#94A3B8"
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
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginbtn}
        disabled={loading}
        onPress={() => LoginRequest()}
      >
        {loading ? (
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            style={styles.loadingIcon}
          >
            <Icon name="spinner" size={20} color="white" />
          </Animatable.View>
        ) : (
          <Text style={styles.loginbtntxt}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createbtn}
        onPress={() => CreateAccount()}
      >
        <Text style={styles.createbtntxt}> Create an account </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or login with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.googleButton}>
          <Icon
            name="google"
            size={20}
            color="#fff"
            style={styles.icongoogle}
          />
          <Text style={styles.buttonText}>Google </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Icon name="facebook" size={20} color="#fff" style={styles.iconfb} />
          <Text style={styles.buttonText}>Facebook </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  passwordInputContainer: {
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: 'black',
    fontWeight: '600',
  },
  socialLoginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  eyeicon: {
    marginRight: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'black',
    marginBottom: 20,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  loginbtn: {
    backgroundColor: '#023AE9',
    borderRadius: 5,
    padding: 13,
    color: 'white',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginbtntxt: {
    textAlign: 'center',
    color: 'white',
  },
  createbtn: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 13,
    color: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  createbtntxt: {
    textAlign: 'center',
    color: 'black',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  line: {
    width: 100,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#555',
    fontWeight: '600',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,

    flex: 1,
  },
  googleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', // Google red color
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  icongoogle: {
    marginRight: 10,
    color: 'red',
  },
  iconfb: {
    marginRight: 10,
    color: 'blue',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loadingIcon: {
    marginRight: 5, // Adjust as needed
  },
});

export default LoginScreen;
