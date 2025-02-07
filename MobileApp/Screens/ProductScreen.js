import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function ProductScreen ({ setIsAuthenticated }) {
  // ✅ Recibe setIsAuthenticated como prop
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        Alert.alert('Error', 'Usuario no autenticado!!')
        return
      }
      const response = await axios.get(
        'http://172.29.37.115:3000/api/productos',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setProducts(response.data.productos)
    } catch (error) {
      console.error(
        'Error al cargar productos:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setIsAuthenticated(false) // ✅ Ahora se actualiza correctamente el estado global
  }

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      {item.imagen
        ? (
          <Image source={{ uri: item.imagen }} style={styles.productImage} />
          )
        : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
          )}
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#00BFFF' />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Título centrado */}
      <Text style={styles.title}>Productos</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Estilos (con el título centrado)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  listContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF'
  },
  productCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10
  },
  noImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  noImageText: {
    color: '#A0A0A0',
    fontSize: 14
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  productPrice: {
    fontSize: 14,
    color: '#00BFFF'
  },
  logoutButtonContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20
  }
})
