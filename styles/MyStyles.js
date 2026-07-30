import { StyleSheet } from "react-native";
import Theme from './Theme';


export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.canvas,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 10,
        backgroundColor: Theme.colors.primary,
        borderRadius: 18,
        ...Theme.shadow,
    },
        header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 60,
        justifyContent: 'center',
    },
    textFieldIcon: {
        color: Theme.colors.textMuted,
         size:20
    }

});
