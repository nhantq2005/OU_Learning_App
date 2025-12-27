import { View, Image, FlatList } from 'react-native'
import { Text, Searchbar } from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import { useState, useEffect } from "react";
import SmallCourseItem from "../components/SmallCourseItem";
import ChipCustom from "../components/ChipCustom";
import Apis, { endpoints } from '../utils/Apis';

const Home = () => {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();

    const loadCategories = async () => {
        try {
            // 'Apis' here refers to the axios instance exported as default above
            let res = await Apis.get(endpoints['categories']);

            // If your API (e.g., Django REST Framework) uses pagination,
            // the data is often in res.data.results.
            // If not paginated, use res.data directly.
            setCategories(res.data.results);

            // Use console.info(obj) instead of template literals to see the full object structure
            console.info("Categories loaded:", res.data);
        } catch (ex) {
            console.error("Failed to load categories:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

useEffect(() => {
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0]);
  }
}, [categories]);


    return (
        <View style={[MyStyles.background, { flex: 1, paddingHorizontal: 18, paddingTop: 18 }]}>
            {/* Header */}
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#1976D2', marginBottom: 2 }}>Xin chào, Nhân 👋</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>Chúc bạn học vui!</Text>
                </View>
                <Image
                    source={{ uri: 'https://i.pinimg.com/736x/fc/5f/0e/fc5f0e02b07c3065c0958b3f54e3dec5.jpg' }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        borderWidth: 2,
                        borderColor: '#1976D2',
                        shadowColor: '#1976D2',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.18,
                        shadowRadius: 4,
                        elevation: 6,
                    }}
                />
            </View>
            {/* Searchbar */}
            <Searchbar
                placeholder="Tìm kiếm khóa học..."
                onChangeText={setSearch}
                value={search}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    elevation: 3,
                    marginBottom: 18,
                    fontSize: 16,
                    paddingHorizontal: 10,
                }}
                inputStyle={{ fontSize: 16 }}
            />
            {/* Title */}
            <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#222', marginBottom: 10, marginTop: 4 }}>Khóa học phổ biến</Text>
            {/* Chip filter */}
            <FlatList
                data={categories}
                keyExtractor={item => item.id?.toString() || item.name}
                renderItem={({ item }) => (
                    <ChipCustom
                        title={item.name}
                        isSelected={selectedCategory && selectedCategory.id === item.id}
                        onPress={() => setSelectedCategory(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4, paddingRight: 8 }}
            />
            {/* List course item */}
            <SmallCourseItem />
        </View>
    )
}

export default Home;