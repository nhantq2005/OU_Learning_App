import React, { useState, useEffect, useContext, useRef, useCallback, use } from "react";
import { View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar, RefreshControl } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { FilterIcon, SlidersHorizontal } from 'lucide-react-native';
import ChipCustom from "../../components/components/ChipCustom";
import Apis, { endpoints } from '../../utils/Apis';
import LargeCourseItem from '../../components/items/LargeCourseItem';
import { MyUserContext } from '../../utils/MyContexts';
import SmallCourseItem from '../../components/items/SmallCourseItem';
import BottomSheet from '../../components/views/BottomSheet';
import Theme from '../../styles/Theme';

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
    const [randomCourses, setRandomCourses] = useState([]);


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
            let url = `${endpoints['categories']}?limit=15&offset=${cateOffset}`;
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

    const loadRandomCourses = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['random_courses']}`;
            let res = await Apis.get(url);
            console.log("Random Courses loaded:", url);
            console.log("RANDOM", res.data);
            setRandomCourses(res.data);
        } catch (ex) {
            setLoading(false);
            console.error("Failed to load random courses:", ex);
        } finally {
            setLoading(false);
        }
    }

    const loadCourses = async () => {
        if (loading) return;
        try {
            setLoading(true);
            let url = `${endpoints['courses']}?limit=20&offset=${offset}`;
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
            loadCategories();
        }, 500);

        return () => clearTimeout(timer);
    }, [filter]);

    useEffect(() => {
        loadRandomCourses();
        loadCategories();
        loadCourses();
    }, []);

    useEffect(() => {
        if (offset > 0) {
            loadCourses(offset);
        }
    }, [offset]);

    useEffect(() => {
        if (cateOffset > 0) {
            loadCategories();
        }
    }, [cateOffset]);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadCourses().then(() => setRefreshing(false));
    }, []);

    const loadMore = () => {
        if (hasNext && !loading) {
            setOffset(offset + 20);
        }
    }

    const loadMoreCategories = () => {
        if (cateHasNext && !cateLoading) {
            setCateOffset(cateOffset + 15);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.canvas} />

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
                    iconColor={Theme.colors.textMuted}
                    placeholderTextColor={Theme.colors.textMuted}
                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => refRBSheet.current.open()}
                    activeOpacity={0.7}
                >
                    <FilterIcon
                        size={22}
                        color={filter.min_price || filter.max_price ? Theme.colors.primary : Theme.colors.textMuted}
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
                    <ActivityIndicator color={Theme.colors.primary} size="large" />
                </View>
            ) : (
                <>
                    {filter.q ? (
                        <FlatList
                            data={courses}
                            keyExtractor={item => item.id?.toString()}
                            renderItem={({ item }) => <SmallCourseItem {...item} />}
                            contentContainerStyle={styles.listContent}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.3}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.colors.primary]} />
                            }
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Không tìm thấy khóa học nào.</Text>
                            }
                        />
                    ) : (

                        <ScrollView showsVerticalScrollIndicator={false} >

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Khóa học ngẫu nhiên</Text>

                            </View>
                            <FlatList
                                data={randomCourses}
                                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                                renderItem={({ item }) => <LargeCourseItem course={item} />}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />
                             <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Khóa học mới</Text>

                            </View>
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


                        </ScrollView>
                    )}
                </>
            )}

            <RBSheet
                ref={refRBSheet}
                useNativeDriver={true}
                height={420}
                customStyles={{
                    wrapper: { backgroundColor: 'rgba(23,32,51,0.38)' },
                    draggableIcon: { backgroundColor: Theme.colors.border, width: 50 },
                    container: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        backgroundColor: Theme.colors.surface,
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
        backgroundColor: Theme.colors.canvas,
        paddingTop: 14,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 22,
        marginTop: 6,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
        letterSpacing: -0.4,
    },
    subGreetingText: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        marginTop: 5,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 3,
        borderColor: Theme.colors.surface,
        ...Theme.shadow,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 14,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.md,
        elevation: 0,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        height: 52,
    },
    searchInput: {
        fontSize: 14,
        alignSelf: 'center',
        top: -2,
    },
    filterButton: {
        width: 52,
        height: 52,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 26,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    seeAllText: {
        fontSize: 14,
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    categoriesList: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    horizontalList: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 96,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: Theme.colors.textMuted,
        marginTop: 40,
        fontSize: 16,
    }
});
