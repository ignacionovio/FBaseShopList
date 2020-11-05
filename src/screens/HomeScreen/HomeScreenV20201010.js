import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
import Swipeout from 'react-native-swipeout';

export default function HomeScreen(props) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    const hecho = "false"
    
    useEffect(() => {
        entityRef
            //.where("authorID", "==", userID)
            //.where("done", "==", hecho)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
                price: 0,
                done: false
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityText('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const onDelButtonPress = () => {
    }

    const renderEntity = ({item, index}) => {

        const swSetting = getSettings(item)

        return (
            <Swipeout {...swSetting}>
                <View style={styles.entityContainer}>
                    <Text style={styles.entityText}>
                        {index} - {item.text} - ${item.price}
                    </Text>
                </View>
            </Swipeout>
        )
    }

    const getSettings = (item) => {
        return {
            autoClose: true,
            onClose: (secId, rowId, direction) => {

            },
            onOpen: (secId, rowId, direction) => {

            },
            right: [
                {
                    onPress: () => {
                        Alert.alert(
                            'Alerta',
                            'Borrar '+ item.text + '?',
                            [
                                {text: 'Si', onPress: () => {
                                    entityRef
                                    .doc(item.id).delete()
                                    .then(console.log('Borra '+item.id))
                                    .catch((error) => {
                                        alert(error)
                                        });
                                    }, style: 'cancel'},
                                {text: 'No', onPress: () => console.log('cancel pressed'), style: 'confirm'}
                            ],
                            {cancelable: true}
                        );
                    },
                    text: 'Borrar', type: 'delete'
                }
            ],
            left: [
                {
                    onPress: () => {
                        Alert.alert(
                            'Alerta',
                            'Borrar '+ item.text + '?',
                            [
                                {text: 'Si', onPress: () => {
                                    entityRef
                                    .doc(item.id).delete()
                                    .then(console.log('Borra '+item.id))
                                    .catch((error) => {
                                        alert(error)
                                        });
                                    }, style: 'cancel'},
                                {text: 'No', onPress: () => console.log('cancel pressed'), style: 'confirm'}
                            ],
                            {cancelable: true}
                        );
                    },
                    text: 'Comprado', type: 'primary'
                }
            ],
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Agregar nuevo item'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
            </View>
            { entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}