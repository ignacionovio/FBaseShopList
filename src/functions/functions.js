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
            sendPushNotification(token.[i],title,body);
            // console.log("Hola");
            // console.log(token.[i]);
            // console.log(title);
            // console.log(body);
        }
    } else {
        sendPushNotification(token,title,body);
        // console.log("Hola2");
        // console.log(token);
        // console.log(title);
        // console.log(body);
    }

};


