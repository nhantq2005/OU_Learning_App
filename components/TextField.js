// import {TextInput} from 'react-native-paper';
// import {View} from 'react-native'
// import Spacing from '../styles/Spacing'

// const TextField = (props) => {

//     return (
//         <View
//             style={{
//                 borderRadius: 20,
//                 backgroundColor: 'white',
//                 elevation: 8,
//                 margin: Spacing.sm,
//                 width: '100%',
//             }}
//         >
//             <TextInput
//                 {...props}
//                 mode="outlined"
//                 outlineStyle={{borderWidth: 0, borderRadius: 20}}
//                 style={{backgroundColor: 'transparent'}}
//             />
//         </View>
//     )
// }

// export default TextField;

import { TextInput } from 'react-native-paper';
import { View } from 'react-native';
import Spacing from '../styles/Spacing';

// 1. Tách left và right ra khỏi props để xử lý riêng
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
                mode="outlined"
                outlineStyle={{ borderWidth: 0, borderRadius: 20 }}
                style={{ backgroundColor: 'transparent' }}

                // 2. Bọc icon vào TextInput.Icon
                // icon={() => left} nghĩa là: "Hãy vẽ component 'left' tôi truyền vào làm icon"
                left={left ? <TextInput.Icon icon={() => left} /> : null}

                // 3. Làm tương tự với right
                right={right ? <TextInput.Icon icon={() => right} /> : null}
            />
        </View>
    )
}

export default TextField;