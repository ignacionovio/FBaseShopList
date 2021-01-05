import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native'
import { firebase } from './src/firebase/config'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen, DoneScreen } from './src/screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
//
import styles from './styles';
import {TouchableOpacity, Text} from 'react-native';

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [done, setDone] = useState(false)

    useEffect(() => {
      const usersRef = firebase.firestore().collection('users');
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          usersRef
            .doc(user.uid)
            .get()
            .then((document) => {
              const userData = document.data()
              setLoading(false)
              setUser(userData)
            })
            .catch((error) => {
              setLoading(false)
            });
        } else {
          setLoading(false)
        }
      });
    }, []);

    if (loading) {
      return (
        <></>
      )
    }

    const cambiaEstado = () => {
      setDone(!done);
    };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        { user ? (
          done ? (
            <Stack.Screen name="Histórico" options={{
              headerLeft: () => (
                //<Button onPress={cambiaEstado} title="< Volver" />
                <TouchableOpacity style={styles.button} onPress={cambiaEstado}>
                  <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
              ),
            }}>
              {props => <DoneScreen {...props} extraData={user} />}
            </Stack.Screen>
          ) : 
          (
            <Stack.Screen name="Comprar" options={{
              headerRight: () => (
                //<Button onPress={cambiaEstado} title="Histórico" />
                <TouchableOpacity style={styles.button} onPress={cambiaEstado}>
                  <Text style={styles.buttonText}>Histórico</Text>
                </TouchableOpacity>
              ),
            }}>
              {props => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Done" component={DoneScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}