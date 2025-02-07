/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen } from './Screens/LoginScreen'
import { ProductScreen } from './Screens/ProductScreen'

const Stack = createStackNavigator()

export default function App () {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name='Login'>
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Productos'>
            {(props) => (
              <ProductScreen
                {...props}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
