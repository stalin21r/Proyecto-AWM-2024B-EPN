/* eslint-disable react/jsx-curly-brace-presence */
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logo from '../assets/logo.png'

export function LoginScreen ({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.')
      return
    }

    try {
      const response = await axios.post('http://172.29.37.115:3000/api/login', {
        usuario: email,
        contrasena: password
      })

      const { message, token } = response.data

      if (response.status === 200) {
        await AsyncStorage.setItem('token', token)
        Alert.alert('Éxito', message)
        onLoginSuccess() // Navegar a la pantalla de productos
      } else {
        Alert.alert('Error', message || 'Credenciales incorrectas')
      }
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error.response?.data?.message || error.message
      )
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      )
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={logo} // Reemplaza con la URL de tu imagen
        style={styles.logo}
      />
      <Text style={styles.loginText}>{'Iniciar Sesión'}</Text>

      <TextInput
        placeholder='Usuario o Correo'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize='none'
        keyboardType='email-address'
      />

      <TextInput
        placeholder='Contraseña'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10, // Reducido el margen inferior para que el texto esté más cerca
    borderRadius: 10
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20 // Espacio antes del campo de usuario
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00BFFF',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F5F5F5'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
