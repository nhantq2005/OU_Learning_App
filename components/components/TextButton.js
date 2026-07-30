import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Theme from "../../styles/Theme";

const TextButton = ({ icon, content, onPress }) => {
    return (
        <Card style={{ marginBottom: 10, borderRadius: Theme.radius.md, elevation: 0, backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, width: '100%' }} onPress={onPress}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                <View style={{ marginRight: 12, backgroundColor: Theme.colors.primarySoft, padding: 9, borderRadius: 10 }}>
                    {icon}
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Theme.colors.text, flex: 1 }}>{content}</Text>
            </TouchableOpacity>
        </Card>

    );
}

export default TextButton;
