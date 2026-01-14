import React, { useState, useEffect, useContext, useRef, useCallback, use } from "react";
import { View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar, RefreshControl } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { FilterIcon, SlidersHorizontal } from 'lucide-react-native';
import ChipCustom from "../components/ChipCustom";
import Apis, { endpoints } from '../utils/Apis';
import LargeCourseItem from '../components/LargeCourseItem';
import { MyUserContext } from '../utils/MyContexts';
import SmallCourseItem from '../components/SmallCourseItem';
import BottomSheet from '../components/BottomSheet';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [courses, setCourses] = useState([]);
    const [user] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [cateOffset, setCateOffset] = useState(0);
    const [cateHasNext, setCateHasNext] = useState(true);
const [cateLoading, setCateLoading] = useState(false);
    const refRBSheet = useRef();

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
        setOffset(0);
    }

    const [filter, setFilter] = useState({
        q: "",
        min_price: "",
        max_price: "",
        category_id: "",
        ordering: "-created_date",
    });

    const loadCategories = async () => {
        try {
            setCateLoading(true);
            let url = `${endpoints['categories']}?limit=5&offset=${cateOffset}`;
            let res = await Apis.get(url);
            console.log("Categories loaded:", url);
            setCateHasNext(res.data.next !== null);
            if (cateOffset === 0)
                setCategories(res.data.results);
            else
                setCategories([...categories, ...res.data.results]);

        } catch (ex) {
            setCateLoading(false);
            console.error("Failed to load categories:", ex);
        } finally {
            setCateLoading(false);
        }
    }

    const loadCourses = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['courses']}?limit=5&offset=${offset}`;
            let res = await Apis.get(url, { params: filter });
            console.log("Courses loaded:", url);
            setHasNext(res.data.next !== null);

            if (offset === 0) {
                setCourses(res.data.results);
            } else {
                setCourses([...courses, ...res.data.results]);
            }
        } catch (ex) {
            setLoading(false);
            console.error("Failed to load courses:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setOffset(0);
            loadCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [filter]);

    useEffect(() => {
        if (offset > 0) {
            loadCourses(offset);
        }
    }, [offset]);

    useEffect(() => {
        if(cateOffset > 0) {
            loadCategories();
        }
    }, [cateOffset]);

    useEffect(() => {
        loadCategories();
    }, []);

    const renderSectionHeader = (title, onPress) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
        </View>
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadCourses().then(() => setRefreshing(false));
    }, []);

    const loadMore = () => {
        if (hasNext && !loading) {
            setOffset(offset + 5);
        }
    }

    const loadMoreCategories = () => {
        if (cateHasNext && !cateLoading) {
            setCateOffset(cateOffset + 5);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

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

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm khóa học..."
                    onChangeText={(t) => handleFilterChange('q', t)}
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
                    <FilterIcon
                        size={22}
                        color={filter.min_price || filter.max_price ? "#1976D2" : "#64748B"}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    data={categories}
                    keyExtractor={item => item.id?.toString()}
                    onEndReached={loadMoreCategories}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item }) => (
                        <ChipCustom
                            title={item.name}
                            isSelected={selectedCategory && selectedCategory.id === item.id}
                            onPress={() => {
                                const isSelected = selectedCategory?.id === item.id;
                                if (isSelected) {
                                    setSelectedCategory(null);
                                    handleFilterChange('category_id', '');
                                } else {
                                    setSelectedCategory(item);
                                    handleFilterChange('category_id', item.id);
                                }
                            }}
                            
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#1976D2" size="large" />
                </View>
            ) : (
                <>
                    {filter.q ? (
                        <FlatList
                            data={courses}
                            keyExtractor={item => item.id?.toString()}
                            renderItem={({ item }) => <SmallCourseItem {...item} />}
                            contentContainerStyle={styles.listContent}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />
                            }
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Không tìm thấy khóa học nào.</Text>
                            }
                        />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {renderSectionHeader("Khóa phổ biến", () => { })}
                            <FlatList
                                data={courses}
                                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.1}
                                renderItem={({ item }) => <LargeCourseItem course={item} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />

                            {renderSectionHeader("Khóa học mới", () => { })}
                            <FlatList
                                data={courses}
                                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                                renderItem={({ item }) => <LargeCourseItem course={item} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />
                        </ScrollView>
                    )}
                </>
            )}

            <RBSheet
                ref={refRBSheet}
                useNativeDriver={true}
                height={420}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
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
        fontWeight: '800',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        elevation: 0,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        height: 50,
    },
    searchInput: {
        fontSize: 15,
        alignSelf: 'center',
        top: -2,
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
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
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
    categoriesList: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    horizontalList: {
        paddingHorizontal: 14,
        paddingBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

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