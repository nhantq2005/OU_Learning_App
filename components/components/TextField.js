import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Theme from '../../styles/Theme';

const TextField = ({ left, right, style, ...props }) => {

    return (
        <View
            style={[styles.container, style]}
        >
            <TextInput
                {...props}
                autoCapitalize="none"
                mode="outlined"
                outlineColor={Theme.colors.border}
                activeOutlineColor={Theme.colors.primary}
                outlineStyle={styles.outline}
                style={styles.input}
                left={left ? <TextInput.Icon icon={() => left} /> : null}
                right={right ? <TextInput.Icon icon={() => right} /> : null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: Theme.radius.md,
        overflow: 'hidden',
        backgroundColor: Theme.colors.surface,
    },
    outline: {
        borderRadius: Theme.radius.md,
        borderWidth: 1,
    },
    input: {
        backgroundColor: Theme.colors.surface,
        fontSize: 15,
    },
});

export default TextField;
