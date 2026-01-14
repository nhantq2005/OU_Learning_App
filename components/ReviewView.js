    import { FlatList, Image, StyleSheet, View, TouchableOpacity, Platform, UIManager, LayoutAnimation } from "react-native";
    import { ActivityIndicator, Button, Card, Text, TextInput, Avatar, ProgressBar, IconButton } from "react-native-paper";
    import { useEffect, useState } from "react";
    import Apis, { authApis, endpoints } from "../utils/Apis";
    import 'moment/locale/vi';
    import moment from 'moment';
    import AsyncStorage from "@react-native-async-storage/async-storage";
    import { Star } from "lucide-react-native";

    const ReviewView = ({ courseId }) => {
        const [reviews, setReviews] = useState([]);
        const [loading, setLoading] = useState(false);
        const [newReview, setNewReview] = useState('');
        const [rating, setRating] = useState(0);
        const [isWriting, setIsWriting] = useState(false);

        const toggleWriting = () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsWriting(!isWriting);
        };

        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

        const validate = () => {
            if (newReview.trim() === '') {
                alert("Vui lòng nhập nội dung đánh giá.");
                return false;
            }
            if (rating === 0) {
                alert("Vui lòng chọn số sao đánh giá.");
                return false;
            }
            return true;
        }

        const loadReviews = async () => {
            try {
                setLoading(true);
                let res = await Apis.get(endpoints['reviews'](courseId));
                setReviews(res.data.results);
            } catch (error) {
                console.error("Failed to load reviews:", error);
            } finally {
                setLoading(false);
            }
        }

        const postReview = async () => {
            if (validate()) {
                try {
                    setLoading(true);
                    const token = await AsyncStorage.getItem("token");
                    await authApis(token).post(endpoints['reviews'](courseId), {
                        comment: newReview,
                        rating: rating
                    });
                    setNewReview('');
                    setRating(0);
                    loadReviews();
                } catch (error) {
                    if (error.response?.status === 500) {
                        alert("Bạn đã đánh giá khóa học này rồi.");
                    } else if (error.response?.status === 403) {
                        alert("Bạn không có quyền đăng đánh giá này.");
                    }
                     else {
                        alert("Có lỗi xảy ra, vui lòng thử lại.");
                    }
                } finally {
                    setLoading(false);
                }
            }
        }

        useEffect(() => {
            if (courseId) loadReviews();
        }, [courseId]);

        const StarRating = ({ score, size = 16, interactive = false, onRate }) => {
            return (
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity 
                            key={star} 
                            disabled={!interactive} 
                            onPress={() => interactive && onRate(star)}
                        >
                            <Star 
                                size={size} 
                                fill={score >= star ? "#FFD700" : "#E0E0E0"} 
                                color={score >= star ? "#FFD700" : "#BDBDBD"} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        };

        if (loading && reviews.length === 0) {
            return <ActivityIndicator style={{ marginTop: 20 }} color="#1976D2" />;
        }

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.sectionHeader}>Đánh giá ({reviews.length})</Text>
                    {!isWriting && (
                        <Button mode="text" onPress={toggleWriting} icon="pencil" textColor="#1976D2">
                            Viết đánh giá
                        </Button>
                    )}
                </View>

                {isWriting && (
                    <Card style={styles.inputCard} mode="elevated" elevation={2}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', color: '#666'}}>Đánh giá của bạn</Text>
                                <IconButton icon="close" size={20} onPress={toggleWriting} />
                            </View>
                            
                            <View style={styles.starInputContainer}>
                                <StarRating score={rating} size={32} interactive={true} onRate={setRating} />
                            </View>

                            <TextInput
                                mode="outlined"
                                value={newReview}
                                onChangeText={setNewReview}
                                placeholder="Nhập nội dung..."
                                multiline
                                style={styles.textInput}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#1976D2"
                            />
                            
                            <Button 
                                mode="contained" 
                                onPress={() => { postReview(); setIsWriting(false); }} 
                                style={styles.postButton}
                                loading={loading}
                            >
                                Gửi
                            </Button>
                        </Card.Content>
                    </Card>
                )}

                <Text style={[styles.sectionHeader, { marginTop: 24, marginBottom: 12 }]}>
                    Đánh giá từ học viên ({reviews.length})
                </Text>
                
                {reviews.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={{ color: '#999' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={reviews}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 60 }}
                        style={{ flex: 1 }}
                        renderItem={({ item }) => (
                            <View style={styles.reviewItem}>
                                {item.user?.avatar ? (
                                    <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                                ) : (
                                    <Avatar.Text size={40} label={item.user?.first_name?.charAt(0) || "U"} style={{backgroundColor: '#E0E0E0', marginRight: 12}} />
                                )}

                                <View style={styles.reviewContent}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.userName}>
                                            {item.user ? `${item.user.last_name} ${item.user.first_name}` : "Người dùng ẩn danh"}
                                        </Text>
                                        <Text style={styles.date}>{moment(item.created_date).fromNow()}</Text>
                                    </View>

                                    <View style={{ marginBottom: 6 }}>
                                        <StarRating score={item.rating} size={14} />
                                    </View>

                                    <Text style={styles.comment}>{item.comment}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        );
    }

    export default ReviewView;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        sectionHeader: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#212121',
            marginBottom: 8,
        },
        inputCard: {
            backgroundColor: '#fff',
            borderRadius: 16,
        },
        starInputContainer: {
            alignItems: 'center',
            marginVertical: 12,
            gap: 8,
        },
        ratingLabel: {
            color: '#1976D2',
            fontWeight: '600',
        },
        textInput: {
            backgroundColor: '#FAFAFA',
            marginBottom: 12,
        },
        postButton: {
            borderRadius: 8,
            backgroundColor: '#1976D2',
        },
        emptyState: {
            padding: 20,
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            borderRadius: 12,
        },
        reviewItem: {
            flexDirection: 'row',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
            borderWidth: 1,
            borderColor: '#F0F0F0',
        },
        reviewContent: {
            flex: 1,
        },
        reviewHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        userName: {
            fontWeight: 'bold',
            fontSize: 14,
            color: '#424242',
        },
        date: {
            fontSize: 12,
            color: '#9E9E9E',
        },
        comment: {
            fontSize: 14,
            color: '#424242',
            lineHeight: 20,
        },
        container: { flex: 1, paddingHorizontal: 4 }, 
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
    });