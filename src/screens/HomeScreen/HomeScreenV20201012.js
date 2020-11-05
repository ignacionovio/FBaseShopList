import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Animated} from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
//import { Swipeable } from '';
import * as GestureHandler from 'react-native-gesture-handler';
const { Swipeable } = GestureHandler;

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
        console.log('onAddButtonPress')
    }

    const onLeftPress = (item) => {
        console.log('onLeftPress')
    };

    const onRightPress = (item) => {
        console.log('onRightPress')
    };

    const renderEntity = ({item, index}) => {

        //const swSetting = getSettings(item)

        return (
            <Swipeable
                renderLeftActions={(progress, dragX) => <LeftActions progress={progress} dragX={dragX} onPress={onLeftPress} />}
                renderRightActions={(progress, dragX) => <RightActions progress={progress} dragX={dragX} onPress={onRightPress} />}
                    //onSwipeableLeftOpen={onSwipeFromLeft(item)}
            >
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {index} - {item.text} - ${item.price}
                </Text>
            </View>
            </Swipeable>
        )
    }

    const RightActions = ({progress, dragX, onPress}) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.rightAction}>
                    <Animated.Text style={[styles.actionText, { transform: [{ scale }]}]}>Borrar</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    }

    const LeftActions = ({progress, dragX, onPress}) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.leftAction}>
                    <Animated.Text style={[styles.actionText, { transform: [{ scale }]}]}>Agregar</Animated.Text>
                </View>
            </TouchableOpacity>
        )
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