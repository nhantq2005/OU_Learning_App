import { Card } from "react-native-paper";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const itemMargin = 5;
const itemWidth = (screenWidth - itemMargin * (numColumns + 1) - 20) / numColumns;

const CategoryItem = ({ category }) => {
    return (
        <Card style={{
            margin: itemMargin,
            width: itemWidth,
            padding: 10,
     backgroundColor: 'white',
        }}>
            <Card.Cover 
                source={{ uri: category.image }}
                style={{ width: '100%', backgroundColor: "transparent" }} 
                    resizeMode="contain"
            />
            <Card.Title title={category.name} titleStyle={{ textAlign: 'center', fontWeight: "bold", fontSize: 18 }} titleNumberOfLines={2} />
        </Card>
    )
}

export default CategoryItem;