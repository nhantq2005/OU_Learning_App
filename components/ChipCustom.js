import { Chip } from 'react-native-paper'
import Colors from "../styles/Colors"
import { useState } from "react";
import Spacing from '../styles/Spacing';

const ChipCustom = () => {
    const [state, setState] = useState(true)
    let chipColor = state
        ? "#167F71"
        : "#E8F1FF";
    const textColor = state
        ? "#FFFFFF"
        : "#202244"
    return (
        <Chip
            style={{ backgroundColor: chipColor, color: textColor, margin: Spacing.sm, padding: Spacing.xs }}
            textStyle={{ color: textColor }}
            onPress={() => setState(!state)}
        >
            Example Chip
        </Chip>

    )
}

export default ChipCustom