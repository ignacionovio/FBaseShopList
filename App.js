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
//import { Notifications } from "expo";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from "expo-permissions";
import * as funciones from './src/functions/functions';

import styles from './styles';
import {TouchableOpacity, Text} from 'react-native';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const getToken = async () => {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  
  //alert('Notif Requested');

  if (status!== "granted") {
    return;
  };
  
  //alert('Notif granted');

  const token = await Notifications.getExpoPushTokenAsync();
  
  if (token.data) {
    global.myToken = token.data;
  };

  //alert(`Notif token: ${ token.data }`);
  // if (global.myUserID) {
  //   alert(global.myUserID);
  // };
  
  // if (global.myToken) {
  //   alert(global.myToken);
  // };
  
  if (global.myToken && global.myUserID) {
    funciones.updateNtfToken(global.myUserID, global.myToken);
  }

  // if (Platform.OS === 'android') {
  //   Notifications.createChannelAndroidAsync('chat-messages', {
  //     name: 'Chat messages',
  //     sound: true,
  //   });
  // }

  return token.data;
};

export default function App() {

  getToken();

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
              if (user.uid) {
                global.myUserID = user.uid;
              }
              if (user.email) {
                global.myEmail = user.email;
              }
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

    const desloguea = () => {
//      getToken();
//      funciones.updateNtfToken(global.myUserID, global.myToken);
      global.myToken = "";
      funciones.updateNtfToken(global.myUserID, global.myToken);
      firebase.auth().signOut();
      setUser(null);
      return(<></>);
    };
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        { user ? (
          done ? (
            <Stack.Screen name="Histórico" options={{
              headerLeft: () => (
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
                <TouchableOpacity style={styles.button} onPress={cambiaEstado}>
                  <Text style={styles.buttonText}>Histórico</Text>
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity style={styles.button} onPress={desloguea}>
                  <Text style={styles.buttonText}>LogOff</Text>
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