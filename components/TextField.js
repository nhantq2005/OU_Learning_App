import {TextInput} from 'react-native-paper';
import {View} from 'react-native'
import Spacing from '../styles/Spacing'

const TextField = (props) => {

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
                mode="outlined"
                outlineStyle={{borderWidth: 0, borderRadius: 20}}
                style={{backgroundColor: 'transparent'}}
            />
        </View>
    )
}

export default TextField;