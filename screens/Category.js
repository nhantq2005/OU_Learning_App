import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native'
import Apis, { endpoints } from '../utils/Apis';
import CategoryItem from '../components/CategoryItem';
import { Text } from 'react-native-paper';
import { CircleChevronLeft } from 'lucide-react-native';


const Category = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['category']);
            setCategories(res.data.results);

            // Use console.info(obj) instead of template literals to see the full object structure
            console.info("Categories loaded:", res.data);
        } catch (ex) {
            setLoading(false);
            console.error("Failed to load categories:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
        console.log("Categories state:", categories);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f6fa', paddingTop: 44, paddingHorizontal: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginBottom: 12 }}>
                <CircleChevronLeft color="#1976D2" size={28} />
                <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#1976D2', marginLeft: 12 }}>Danh mục khóa học</Text>
            </View>

            <FlatList
                key={2}
                data={categories}
                keyExtractor={item => item.id?.toString() || item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => console.info(item.id)}>
                        <CategoryItem category={item} />
                    </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingBottom: 18,
                    gap: 8,
                }}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default Category