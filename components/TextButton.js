import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const TextButton = ({ icon, content, onPress }) => {
    return (
        <Card style={{ marginBottom: 8, borderRadius: 12, elevation: 0, backgroundColor: '#F5F9FF', width: '100%' }} onPress={onPress}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                <View style={{ marginRight: 10, backgroundColor: '#E3F2FD', padding: 8, borderRadius: 8 }}>
                    {icon}
                </View>
                <Text style={{ fontSize: 16, color: '#222', flex: 1 }}>{content}</Text>
            </TouchableOpacity>
        </Card>

    );
}

export default TextButton;