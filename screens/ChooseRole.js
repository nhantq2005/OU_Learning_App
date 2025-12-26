import { TouchableOpacity, View } from "react-native"
import MyStyles from "../styles/MyStyles"
import { Text, Button, Card } from "react-native-paper";
import { useState, useContext, use, useEffect } from "react";
import Colors from "../styles/Colors";
import { RegisterContext } from "../utils/MyContexts";
import { useNavigation } from "@react-navigation/native";
import { CircleArrowLeft } from "lucide-react-native";

const ChooseRole = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const nav = useNavigation();
    const { registerData, updateRegisterData } = useContext(RegisterContext);

    const nextStep = () => {
        if (selectedRole) {
            updateRegisterData({ role: selectedRole, is_verified: selectedRole === "teacher" ? false : true });
            nav.navigate("RegisterAccount");
        } else {
            alert("Vui lòng chọn vai trò trước khi tiếp tục.");
        }
    };

    useEffect(() => {
        console.log("PUSH DATA: ", registerData);
    }, [registerData]);

    return (
        <View style={[MyStyles.background, MyStyles.center, {justifyContent:"space-evenly"}]}>
            <TouchableOpacity onPress={() => console.log("Selected Role:", selectedRole)} style={{position: "absolute", top: 30, left: 20}}><CircleArrowLeft /></TouchableOpacity>
            <Text variant="headlineMedium" style={[MyStyles.headline, {margin: 30}]}>Bạn là...</Text>
            <View style={[ MyStyles.row]}>
                <TouchableOpacity onPress={() => setSelectedRole("teacher")}>
                    <Card style={{ justifyContent: 'center', alignItems: 'center', margin: 5, padding: 10, backgroundColor: selectedRole === "teacher" ? Colors.light.primaryContainer : 'white' }}>
                        <Card.Cover source={require("../assets/teacher.png")} style={{ width: 150, height: 150, backgroundColor: "transparent" }} />
                        <Card.Title title="Giảng viên" titleStyle={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }} />
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedRole("student")}>
                    <Card style={{ justifyContent: 'center', alignItems: 'center', margin: 5, padding: 10, backgroundColor: selectedRole === "student" ? Colors.light.primaryContainer : 'white' }}>
                        <Card.Cover source={require("../assets/student.png")} style={{ width: 150, height: 150, backgroundColor: "transparent" }} />
                        <Card.Title title="Sinh viên" titleStyle={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }} />
                    </Card>
                    {console.log(selectedRole)}
                </TouchableOpacity>
            </View>
            <Button mode="contained" style={[MyStyles.button, MyStyles.buttonText]} onPress={() => {
                nextStep(); 
            }}>Tiếp tục</Button>
        </View>
    )
}

export default ChooseRole;