import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
        fontSize: 16
    },
    button: {
        height: 30,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        alignItems: 'stretch',
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 2,
        paddingBottom: 25
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    leftAction: {
        backgroundColor: '#388e3c',
        justifyContent: 'center',
        flex: 1,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20
    },
    rightAction: {
        backgroundColor: '#dd2c00',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
})