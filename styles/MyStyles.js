import { StyleSheet } from "react-native";
import Colors from "./Colors";
import Spacing from "./Spacing";

export default StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    button: {
        alignItems: "center",
        backgroundColor: Colors.light.primary,
        width: '100%',
        marginTop: Spacing.md,
    },
    buttonText: {
        color:Colors.light.onPrimary,
        margin: Spacing.sm,
        padding: Spacing.xs,
        fontSize: 25,
    },
    avartar:{
        borderRadius: 40,
        width: 50,
        height: 50,
    },
    background: {
        backgroundColor: Colors.light.background,
        padding: Spacing.md
    },
    text:{
        margin: Spacing.md
    },
    categoryTitle: {

    },
    card:{
        // margin: Spacing.sm
    },
    title: {
        marginTop:Spacing.sm,
        // marginBottom:Spacing.sm
    }
});