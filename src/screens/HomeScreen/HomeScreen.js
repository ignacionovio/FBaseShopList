import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Animated, TouchableWithoutFeedback} from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
import * as GestureHandler from 'react-native-gesture-handler';
import moment from 'moment';
const { Swipeable } = GestureHandler;
import * as funciones from '../../functions/functions';

moment.locale('es');

export default function HomeScreen(props) {
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])
    const [entityPrice, setEntityPrice] = useState('')
    const entityRef = firebase.firestore().collection('entities')
    const userID = global.myUserID
    if (props.extraData) {
        global.myFullName = props.extraData.fullName;
    
        if (props.extraData.group) {
            global.myGroup = props.extraData.group;
        };
    }

    const [users, setUsers] = useState([])

    const usersRef = firebase.firestore().collection('users');

    if (global.myGroup) {
        useEffect(() => {
            usersRef
                .where("group", "==", global.myGroup)
                .onSnapshot(
                    querySnapshot => {
                        const newUsers = []
                        querySnapshot.forEach(doc => {
                            const user = doc.data()
                            newUsers.push(user)
                        });
                        setUsers(newUsers)
                    },
                    error => {
                        console.log(error)
                    }
                )
        }, []);
    };

    global.myUsers = users;

//.orderBy("createdAt","desc")
    //////////////////
    if (global.myGroup) {
        useEffect(() => {
            entityRef
                .where("done", "==", false).where("grupo", "==", global.myGroup)
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
    };

    const onAddButtonPress = () => {

        funciones.notifica(global.myUserID,'todos',"Item agregado",`${ global.myFullName } agregó a la lista: ${ entityText }`);

        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
                price: 0,
                done: false,
                doneAt: null,
                enviado: false,
                grupo: global.myGroup,
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

    const onLeftPress = (item, precio) => {

        setEntityPrice(precio)

        //if (item.authorID !== global.myUserID) {
            funciones.notifica(item.authorID,'uno',"Item cumplido",`${ global.myFullName } compró: ${ item.text } Precio: $ ${ precio } `);
        //};

        const timestampDone = firebase.firestore.FieldValue.serverTimestamp();
        entityRef
        .doc(item.id).update({done: true, price: precio, doneAt: timestampDone})
        .then(_doc => {
            setEntityPrice('')
            Keyboard.dismiss()
        })
        .catch((error) => {
            alert(error)
            });
    };

    const onRightPress = (item) => {
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
                    {formatDate(item.createdAt)} - {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
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
            <View style={styles.leftAction}>
                <TextInput 
                    onSubmitEditing={(text) => {setEntityPrice(entityNewPrice), acciones()}}
                    style={styles.input}
                    placeholder='$'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    onChangeText={setEntityNewPrice}
                    value={entityNewPrice}
                    blurOnSubmit={false}
                    returnKeyType="done"
                />
            </View>
        )
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

