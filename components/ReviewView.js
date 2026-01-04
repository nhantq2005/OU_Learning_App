import { FlatList, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import TextField from './TextField';
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../utils/Apis";
import 'moment/locale/vi';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    // Số sao đánh giá
    try {
      setLoading(true);
      // endpoints['reviews'] là hàm, cần truyền courseId vào
      let res = await Apis.get(endpoints['reviews'](courseId));

      // const url = `/courses/${courseId}/reviews/`;
      // let res = await Apis.get(url);

      // SỬA LỖI LOGIC: Dùng res.data thay vì res.data.results
      setReviews(res.data);

      console.info("Reviews loaded:", res.data);
    } catch (error) {
      setLoading(false);
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
        let res = await authApis(token).post(endpoints['reviews'](courseId), {
          comment: newReview,
          rating: rating
        });
        console.info("Review posted:", res.data);
        setNewReview('');
        setRating(0);
        loadReviews(); // Tải lại danh sách đánh giá sau khi đăng thành công
      } catch (error) {
        if (error.response?.status === 500) {
          alert("Bạn đã đánh giá khóa học này rồi.");
        }
        setLoading(false);
        console.error("Failed to post review:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (courseId) {
      loadReviews();
    }
  }, [courseId]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{ height: 300 }}>
          <View style={{ marginBottom: 10 }}>
            {/* Chọn số sao đánh giá */}
            <View style={{ flexDirection: 'row', marginBottom: 6, justifyContent: 'space-evenly', width: '100%' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[rating >= star ? styles.starSelected : styles.starUnselected, { fontSize: 35 }]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}> */}
            <TextField value={newReview} onChangeText={setNewReview} placeholder="Viết đánh giá của bạn..." style={{ width: '80%' }} />
            <Button mode="contained" onPress={postReview}>Đăng đánh giá</Button>
            {/* </View> */}
          </View>
          {reviews.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>Chưa có đánh giá nào.</Text>
          ) : (
            // <View style={{ flex: 1 }}>
              <FlatList
                data={reviews}
                contentContainerStyle={{ paddingBottom: 16 }}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <Card style={styles.card}>
                    <View style={styles.container}>
                      <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
                      <View style={styles.contentBox}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={styles.name}>{item.user ? `${item.user.last_name} ${item.user.first_name}` : "Người dùng"}</Text>
                          <Text style={styles.date}>{moment(item.created_date).fromNow()}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Text key={star} style={item.rating >= star ? styles.starSelected : styles.starUnselected}>★</Text>
                          ))}
                        </View>
                        <Text style={styles.content}>{item.comment}</Text>
                        {/* Format ngày tháng cho dễ đọc */}

                      </View>
                    </View>
                  </Card>
                )}
              />
            // </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 2,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contentBox: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2a4d8f',
    marginBottom: 2,
  },
  content: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },

  starSelected: {
    color: '#FFD700',
    fontSize: 22,
    marginHorizontal: 1,
  },
  starUnselected: {
    color: '#ccc',
    fontSize: 22,
    marginHorizontal: 1,
  },
});

export default ReviewView;