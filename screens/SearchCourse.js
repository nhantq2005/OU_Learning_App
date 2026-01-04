import { FlatList, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import ChipCustom from "../components/ChipCustom";
import MyStyles from "../styles/MyStyles";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../utils/Apis";
import SmallCourseItem from "../components/SmallCourseItem";

const SearchCourse = () => {
        const [search, setSearch] = useState('');
        const [categories, setCategories] = useState([]);
            const [selectedCategory, setSelectedCategory] = useState();
        
            const loadCategories = async () => {
                try {
                    let res = await Apis.get(endpoints['categories']);
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
                console.log("Categories state:", categories);
            }, []);
        
            useEffect(() => {
                if (categories.length > 0 && !selectedCategory) {
                    setSelectedCategory(categories[0]);
                }
            }, [categories]);
    return (
        <View style={[MyStyles.background, { flex: 1, paddingHorizontal: 18, paddingTop: 18 }]}>
            {/* Header */}
            {/* Searchbar */}
            <Searchbar
                placeholder="Tìm kiếm khóa học..."
                onChangeText={setSearch}
                value={search}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    elevation: 3,
                    marginBottom: 8,
                    fontSize: 16,
                    paddingHorizontal: 2,
                }}
                inputStyle={{ fontSize: 16 }}
            />
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
                contentContainerStyle={{ paddingVertical: 4, }}
                style={{ marginHorizontal: -16, marginBottom: 1, flexGrow: 0 }}
            />
            <View style={{ flex: 1 }}>

                        <FlatList
                data={categories}
                keyExtractor={item => item.id?.toString() || item.name}
                renderItem={({ item }) => (
                    <SmallCourseItem />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4, }}
                style={{ marginHorizontal: -16, flexGrow: 0 }}
            />
            
</View>
        </View>
    );
}

export default SearchCourse;