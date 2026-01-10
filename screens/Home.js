import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { FilterIcon, SlidersHorizontal } from 'lucide-react-native'; // Dùng icon đẹp hơn nếu có

import MyStyles from "../styles/MyStyles";
import ChipCustom from "../components/ChipCustom";
import Apis, { endpoints } from '../utils/Apis';
import LargeCourseItem from '../components/LargeCourseItem';
import { MyUserContext } from '../utils/MyContexts';
import SmallCourseItem from '../components/SmallCourseItem';
import BottomSheet from '../components/BottomSheet';

const { width } = Dimensions.get('window');

const Home = () => {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [courses, setCourses] = useState([]);
    const [user] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    
    // State gộp chung cho filter
    const [filter, setFilter] = useState({
        q: "",
        min_price: "",
        max_price: "",
        category_id: "",
        ordering: "-created_date",
    });

    const refRBSheet = useRef();

    // --- API HANDLERS ---
    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data.results);
        } catch (ex) {
            console.error("Failed to load categories:", ex);
        }
    }

    const loadCourses = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['courses'], { params: filter });
            setCourses(res.data.results);
        } catch (ex) {
            console.error("Failed to load courses:", ex);
        } finally {
            setLoading(false);
        }
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => loadCourses(), 500);
        return () => clearTimeout(timer);
    }, [filter]);

    // Initial Load
    useEffect(() => {
        loadCategories();
        // console.info("USER INFO:", user);
    }, []);

    // Select default category
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories]);


    // --- RENDER HELPERS ---
    const renderSectionHeader = (title, onPress) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            
            {/* --- HEADER SECTION --- */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.greetingText}>Xin chào, {user?.last_name || 'Bạn'} 👋</Text>
                    <Text style={styles.subGreetingText}>Chúc bạn một ngày học tập hiệu quả!</Text>
                </View>
                <Image
                    source={{ uri: user?.avatar || 'https://i.pinimg.com/736x/fc/5f/0e/fc5f0e02b07c3065c0958b3f54e3dec5.jpg' }}
                    style={styles.avatar}
                />
            </View>

            {/* --- SEARCH & FILTER BAR --- */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm khóa học..."
                    onChangeText={(t) => setFilter({ ...filter, q: t })}
                    value={filter.q}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor="#94A3B8"
                    placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity 
                    style={styles.filterButton} 
                    onPress={() => refRBSheet.current.open()}
                    activeOpacity={0.7}
                >
                    {/* Nếu có filter active thì đổi màu icon */}
                    <FilterIcon 
                        size={22} 
                        color={filter.min_price || filter.max_price ? "#1976D2" : "#64748B"} 
                    />
                </TouchableOpacity>
            </View>

            {/* --- MAIN CONTENT --- */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#1976D2" size="large" />
                </View>
            ) : (
                <>
                    {/* Hiển thị kết quả tìm kiếm nếu có từ khóa */}
                    {filter.q ? (
                        <FlatList
                            data={courses}
                            keyExtractor={item => item.id?.toString()}
                            renderItem={({ item }) => <SmallCourseItem {...item} />}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Không tìm thấy khóa học nào.</Text>
                            }
                        />
                    ) : (
                        /* Hiển thị Home Dashboard mặc định */
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            
                            {/* Categories */}
                            {renderSectionHeader("Danh mục", () => console.log("All Cats"))}
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
                                contentContainerStyle={styles.categoriesList}
                            />

                            {/* Popular Courses */}
                            {renderSectionHeader("Khóa phổ biến", () => {})}
                            <FlatList
                                data={courses}
                                keyExtractor={item => item.id?.toString()}
                                renderItem={({ item }) => <LargeCourseItem course={item} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />

                            {/* New Courses */}
                            {renderSectionHeader("Khóa học mới", () => {})}
                            <FlatList
                                data={courses}
                                keyExtractor={item => item.id?.toString()}
                                renderItem={({ item }) => <LargeCourseItem course={item} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />
                        </ScrollView>
                    )}
                </>
            )}

            {/* --- BOTTOM SHEET --- */}
            <RBSheet
                ref={refRBSheet}
                useNativeDriver={true}
                height={420} // Tăng chiều cao để thoải mái
                customStyles={{
                    wrapper: { backgroundColor: 'rgba(0,0,0,0.3)' },
                    draggableIcon: { backgroundColor: '#CBD5E1', width: 50 },
                    container: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        backgroundColor: '#fff',
                        elevation: 20
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
            >
                <BottomSheet filter={filter} setFilter={setFilter} />
            </RBSheet>
        </View>
    )
}

export default Home;

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Màu nền xám xanh nhạt hiện đại
        paddingTop: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    greetingText: {
        fontSize: 22,
        fontWeight: '800', // Extra bold
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    subGreetingText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
        // Shadow cho avatar
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    
    // Search Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
        gap: 12, // Khoảng cách giữa search bar và nút filter
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        elevation: 0, // Tắt shadow mặc định của Paper
        borderWidth: 1,
        borderColor: '#E2E8F0', // Viền xám nhạt
        height: 50,
    },
    searchInput: {
        fontSize: 15,
        alignSelf: 'center', // Căn giữa text trong input
        top: -2, // Hack nhỏ để text input của Paper căn giữa theo chiều dọc đẹp hơn
    },
    filterButton: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        // Shadow nhẹ
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    // Sections
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    seeAllText: {
        fontSize: 14,
        color: '#1976D2',
        fontWeight: '600',
    },

    // Lists
    categoriesList: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    horizontalList: {
        paddingHorizontal: 14, // Để item đầu tiên thụt vào một chút
        paddingBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    
    // Helpers
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginTop: 40,
        fontSize: 16,
    }
});