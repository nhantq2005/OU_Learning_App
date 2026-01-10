import { FlatList, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Card, Text, TextInput, Avatar, ProgressBar } from "react-native-paper";
import { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../utils/Apis";
import 'moment/locale/vi';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Star } from "lucide-react-native"; // npm install lucide-react-native

const ReviewView = ({ courseId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);

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
            setReviews(res.data);
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
                } else {
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

    // Component hiển thị sao (Refactor nhỏ để tái sử dụng)
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
            {/* --- Form Đánh Giá --- */}
            <Card style={styles.inputCard} mode="elevated" elevation={1}>
                <Card.Content>
                    <Text style={styles.sectionHeader}>Viết đánh giá của bạn</Text>
                    
                    <View style={styles.starInputContainer}>
                        <StarRating score={rating} size={32} interactive={true} onRate={setRating} />
                        <Text style={styles.ratingLabel}>{rating > 0 ? `${rating}/5 Tuyệt vời!` : 'Chạm để xếp hạng'}</Text>
                    </View>

                    <TextInput
                        mode="outlined"
                        value={newReview}
                        onChangeText={setNewReview}
                        placeholder="Chia sẻ cảm nghĩ về khóa học..."
                        multiline
                        numberOfLines={3}
                        style={styles.textInput}
                        outlineColor="#E0E0E0"
                        activeOutlineColor="#1976D2"
                        theme={{ roundness: 12 }}
                    />
                    
                    <Button 
                        mode="contained" 
                        onPress={postReview} 
                        style={styles.postButton}
                        loading={loading}
                        disabled={loading}
                    >
                        Gửi đánh giá
                    </Button>
                </Card.Content>
            </Card>

            {/* --- Danh Sách Đánh Giá --- */}
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
                    scrollEnabled={false} // QUAN TRỌNG: Để không xung đột với ScrollView cha
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.reviewItem}>
                            {/* Avatar */}
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
    // Input Card Styles
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
    // Review List Styles
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
});