import React, { useEffect, useState } from 'react'
import { firebase } from '../firebase/config';

export const notifica = (userID, mode, title, body) => {

    const [entities, setEntities] = useState([])
    
    let token

    // if (mode == 'todos') {
    // };
    
    if (mode == 'otros') {
        token = global.myToken
    };

    if (mode == 'uno') {
        token = global.myToken
    };

    const sendPushNotification = (token, title, body) => {
        return fetch('https://exp.host/--/api/v2/push/send', {
            body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
            sound: "default",
            icon: "../../assets/payment-method.png",
            android:{
                icon: "../../assets/payment-method.png",
                sound:"default"
            }
            }),
            headers: {
            'Content-Type': 'application/json',
            },
            method: 'POST',
        });
    };

    sendPushNotification(token,title,body);

    getTokensToInform();

    const getTokensToInform = () => {
        const usersRef = firebase.firestore().collection('users');

        useEffect(() => {
            usersRef
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

        console.log(users);
    };
};


