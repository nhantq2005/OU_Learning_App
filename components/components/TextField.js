import { TextInput } from 'react-native-paper';
import { View } from 'react-native';
import Spacing from '../../styles/Spacing';

const TextField = ({ left, right, ...props }) => {

    return (
        <View
            style={{
                borderRadius: 20,
                backgroundColor: 'white',
                elevation: 8,
                margin: Spacing.sm,
                width: '100%',
            }}
        >
            <TextInput
                {...props}
                autoCapitalize="none"
                mode="outlined"
                outlineStyle={{ borderWidth: 0, borderRadius: 20 }}
                style={{ backgroundColor: 'transparent' }}
                left={left ? <TextInput.Icon icon={() => left} /> : null}
                right={right ? <TextInput.Icon icon={() => right} /> : null}
            />
        </View>
    )
}

export default TextField;