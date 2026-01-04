import { View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Searchbar } from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import { useState, useEffect, useContext } from "react";
import ChipCustom from "../components/ChipCustom";
import Apis, { endpoints } from '../utils/Apis';
import LargeCourseItem from '../components/LargeCourseItem';
import { MyUserContext } from '../utils/MyContexts';
import SmallCourseItem from '../components/SmallCourseItem';

const Home = () => {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [courses, setCourses] = useState([]);
    const [user,] = useContext(MyUserContext)
    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data.results);



            // Use console.info(obj) instead of template literals to see the full object structure
            // console.info("Categories loaded:", res.data);
        } catch (ex) {
            setLoading(false);
            console.error("Failed to load categories:", ex);
        } finally {
            setLoading(false);
        }
    }

    const loadCourses = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['courses']}?`;

            if (search) {
                url = `${url}&q=${search}`;
            }

            if (selectedCategory) {
                url = `${url}&category_id=${selectedCategory.id}`;
            }
            let res = await Apis.get(url);
            setCourses(res.data.results);
            console.info("Courses loaded:", res.data);
        } catch (ex) {
            setLoading(false);
            console.error("Failed to load courses:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, [search, selectedCategory]);

    useEffect(() => {
        loadCategories();
        // loadCourses();
        // console.log("Categories state:", categories);

        console.info("NGUOI DUNG", user);
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories]);


    return (
        // <View >
        <View style={[MyStyles.background, { flex: 1, }]}>

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
            
                {search ? (
                    <FlatList
                    data={courses}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={({ item }) => (
                        <SmallCourseItem {...item} />
                    )}
                    />
                ) : (
                <ScrollView extraScrollHeight={20}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#222', marginBottom: 10, marginTop: 4 }}>Danh mục</Text>
                    <TouchableOpacity onPress={() => console.log("See all categories")}>
                        <Text style={{ color: '#1976D2', fontSize: 14 }}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={categories}
                    keyExtractor={item => item.id?.toString()}
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
                    style={{ marginHorizontal: -18, marginBottom: 4, flexGrow: 0 }}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#222', marginBottom: 10, marginTop: 0 }}>Khóa phổ biến</Text>
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={({ item }) => (
                        <LargeCourseItem course={item} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 10 }}
                    style={{ marginHorizontal: -18, flexGrow: 0 }}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#222' }}>Khóa học mới</Text>
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={({ item }) => (
                        <LargeCourseItem course={item} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 10 }}
                    style={{ marginHorizontal: -18, flexGrow: 0, paddingBottom: 20 }}

                />
                </ScrollView>
                )}


        </View>
    )
}

export default Home;