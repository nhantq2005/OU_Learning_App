import { View, Text } from "react-native";

const TagItem = ({ tag }) => {
    return (
        <View style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 8,
            marginBottom: 8,
            alignSelf: "flex-start",
            borderWidth: 1.5,
            borderColor: "#1976D2"
        }}>
            <Text style={{ color: "#1976D2", fontWeight: "bold" }}>{tag}</Text>
        </View>
    );
};

export default TagItem;