import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Animated, TouchableWithoutFeedback} from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
import * as GestureHandler from 'react-native-gesture-handler';
const { Swipeable } = GestureHandler;
import * as funciones from '../../functions/functions';

let moment = require('moment');
moment.locale('es');

export default function DoneScreen(props) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])
    const [entityPrice, setEntityPrice] = useState('')

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    
    useEffect(() => {
        entityRef
            //.where("authorID", "==", userID)
            //.where("done", "==", true)
            .where("done", "==", true).where("grupo", "==", global.myGroup)
            //.get()
            //.orderBy('createdAt', 'desc')
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
    }, []);

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
                price: 0,
                done: false,
                doneAt: null
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
    };

    const onLeftPress = (item) => {

        const acciones = () => {
            alert('Item Reacivado');
            funciones.notifica(global.myUserID,'otros',"Item Reactivado",`${ global.myFullName } reactivo el item: ${ item.text }`);
            setEntityPrice(0)
        };

        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const data = {
            text: item.text,
            authorID: global.myUserID,
            createdAt: timestamp,
            price: 0,
            done: false,
            doneAt: null,
            enviado: false,
            grupo: item.grupo
        };
        entityRef
            .add(data)
            .then(
                acciones()
            )
            .catch((error) => {
                alert(error)
            });
    };

    const onRightPress = (item) => {

        const acciones = () => {
            if (item.authorID !== global.myUserID) {
                funciones.notifica(item.authorID,'uno',"Item Borrado",`${ global.myFullName } borró: ${ item.text } `)
            }
        }

        Alert.alert(
            'Alerta',
            'Borrar '+ item.text + '?',
            [
                {text: 'Si', onPress: () => {
                    entityRef
                    .doc(item.id).delete()
                    .then(
                            acciones()
                        )
                    .catch((error) => {
                        alert(error)
                        });
                    }, style: 'cancel'},
                {text: 'No', onPress: () => console.log('cancel pressed'), style: 'confirm'}
            ],
            {cancelable: true}
        );
    };

    const renderEntity = ({item, index}) => {

        const formatDate = (fechatmstmp = '01/01/1900') => {
            let fechaString
            if (fechatmstmp == null) {
                fechaString = moment().format('DD/MMM/YY');
            }
            else {
                fechatmstmp = fechatmstmp.toDate();
                fechaString = moment(fechatmstmp).format('DD/MMM/YY');
            }
            return (fechaString);
        };
        
        return (
            <Swipeable
                renderLeftActions={(progress, dragX ) => <LeftActions progress={progress} dragX={dragX} onPress={onLeftPress} item={item}/>}
                renderRightActions={(progress, dragX ) => <RightActions progress={progress} dragX={dragX} onPress={onRightPress} item={item}/>}
            >
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {formatDate(item.doneAt)} - {item.text.charAt(0).toUpperCase() + item.text.slice(1)} - ${item.price}
                </Text>
            </View>
            </Swipeable>
        )
    }

    const RightActions = ({progress, dragX, onPress, item}) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.rightAction}>
                    <Animated.Text style={[styles.actionText, { transform: [{ scale }]}]}>Borrar</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    };

    const LeftActions = ({progress, dragX, onPress, item}) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        
        const [entityNewPrice, setEntityNewPrice] = useState('')

        const acciones = () => {
            onPress(item, entityNewPrice);
        };
 
        return (
            // <View style={styles.leftAction}>
            //     <TextInput 
            //         onSubmitEditing={(text) => {setEntityPrice(entityNewPrice), acciones()}}
            //         style={styles.input}
            //         placeholder='$'
            //         placeholderTextColor="#aaaaaa"
            //         underlineColorAndroid="transparent"
            //         keyboardType="numeric"
            //         onChangeText={setEntityNewPrice}
            //         value={entityNewPrice}
            //         blurOnSubmit={false}
            //         returnKeyType="done"
            //     />
            // </View>
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.leftAction}>
                    <Animated.Text style={[styles.actionText, { transform: [{ scale }]}]}>Repetir</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                { entities && (
                    <View style={styles.listContainer}>
                        <FlatList 
                            contentContainerStyle = {{justifyContent:'center',}}
                            data={entities}
                            renderItem={renderEntity}
                            keyExtractor={(item) => item.id}
                            removeClippedSubviews={true}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    )
}