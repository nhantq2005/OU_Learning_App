import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import TagItem from "./TagItem";

const DetailView = ({ currentCourse }) => {
    return (
        <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {currentCourse.tags.map(tag =>
                    <TagItem key={tag.id} tag={tag.name} />
                )}
            </View>
            <Text style={{ fontSize: 16, color: '#222', marginBottom: 16, lineHeight: 22 }}>{currentCourse.description}</Text>
            <Button
                mode="contained"
                style={{ borderRadius: 10, backgroundColor: '#1976D2', marginTop: 8, width: '100%' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                onPress={() => { }}
            >
                Đăng ký học ngay
            </Button>
        </>
    );
}
export default DetailView;