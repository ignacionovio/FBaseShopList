import { firebase } from '../firebase/config'

const usersRef = firebase.firestore().collection('users');

export const updateNtfToken = (UserID, Token) => {
    //alert(`User ID: ${ UserID }\n Token: ${ Token }`);
    if (UserID) {
        usersRef
        .doc(UserID).update({ntfToken: Token})
        .catch((error) => {
            alert(error);
        });
    };
};

export const updateGroup = (UserID, grupo) => {
    //alert(`User ID: ${ UserID }\n Token: ${ Token }`);
    if (UserID) {
        usersRef
        .doc(UserID).update({group: grupo})
        .catch((error) => {
            alert(error);
        });
    };
};

export const logNotifs = (UserID, Token, title, body) => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const ntfLogsRef = firebase.firestore().collection('notifications');
    //////////////////
    const data = {
        RtteUserID: UserID,
        destToken: Token,
        title: title,
        body: body,
        sent: timestamp
    };
    ntfLogsRef
        .add(data)
        // .then(_doc => {
        // })
        .catch((error) => {
            alert(error)
        });
    //////////////////
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

export const notifica = (userID, mode, title, body) => {
    
    let token = []

    if (mode == 'todos') {

        const newTokens = global.myUsers;

        for (let i = 0; i < newTokens.length; i++) {
            token.push(newTokens.[i].ntfToken);
        }
    };

    if (mode == 'otros') {

        const newTokens = global.myUsers.filter(filtro => filtro.id != userID);

        for (let i = 0; i < newTokens.length; i++) {
            token.push(newTokens.[i].ntfToken);
        }
    };

    if (mode == 'uno') {
        
        const newTokens = global.myUsers.filter(filtro => filtro.id == userID);

        token = newTokens.[0].ntfToken
    };

    if (Array.isArray(token)) {
        for (let i = 0; i < token.length; i++) {
            if (token.[i]) {
                sendPushNotification(token.[i],title,body);
                logNotifs(global.myUserID, token.[i], title, body);
            }
        }
    } else {
        if (token) {
            sendPushNotification(token,title,body);
            logNotifs(global.myUserID, token, title, body);
        }
    }

};


