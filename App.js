import { SafeAreaView } from 'react-native-safe-area-context';
import { MyUserProvider } from './utils/providers/MyUserProvider';
import AppNavigation from './navigation/AppNavigation';
import { NotificationProvider } from './utils/providers/NotificationProvider';



export default function App() {
    return (
        // <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <MyUserProvider>
                <NotificationProvider>
                    <AppNavigation />
                </NotificationProvider>
            </MyUserProvider>
        // {/* </SafeAreaView> */}
    );
}
