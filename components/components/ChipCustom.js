import { Chip } from 'react-native-paper'
import Theme from '../../styles/Theme';

const ChipCustom = ({ title, isSelected, onPress }) => {
    const chipColor = isSelected ? Theme.colors.primary : Theme.colors.surface;
    const textColor = isSelected ? Theme.colors.surface : Theme.colors.textMuted;
    return (
        <Chip
            style={{
                backgroundColor: chipColor,
                marginRight: 8,
                paddingHorizontal: 6,
                borderRadius: Theme.radius.pill,
                borderWidth: isSelected ? 0 : 1,
                borderColor: Theme.colors.border,
                alignSelf: 'flex-start',
            }}
            textStyle={{ color: textColor, fontSize: 13, fontWeight: '600' }}
            onPress={onPress}
        >
            {title}
        </Chip>
    )
}

export default ChipCustom
