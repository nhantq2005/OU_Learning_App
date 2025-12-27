import { Chip } from 'react-native-paper'
import Colors from "../styles/Colors"
import Spacing from '../styles/Spacing';

const ChipCustom = ({ title, isSelected, onPress }) => {
    let chipColor = isSelected ? "#167F71" : "#E8F1FF";
    const textColor = isSelected ? "#FFFFFF" : "#202244";
    return (
        <Chip
            style={{
                backgroundColor: chipColor,
                color: textColor,
                margin: Spacing.xs,
                paddingHorizontal: 6,
                paddingVertical: 2,
                alignSelf: 'flex-start',
            }}
            textStyle={{ color: textColor }}
            onPress={onPress}
        >
            {title}
        </Chip>
    )
}

export default ChipCustom