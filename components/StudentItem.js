import { View } from "react-native"

const StudentItem = ({ student }) => {
  return (
    <View>
      <Text>{student.name}</Text>
    </View>
  )
}   

export default StudentItem