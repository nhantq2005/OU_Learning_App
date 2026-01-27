// FILE: components/LessonsView.js
import { Edit, Eye, EyeOff, Trash } from 'lucide-react-native';
import React from 'react';
import { FlatList, TouchableOpacity, Text, View, Image, RefreshControl } from 'react-native';
import LessonItem from '../items/LessonItem';
import { ActivityIndicator, Snackbar } from 'react-native-paper';

const LessonsView = ({ lessons, onPressLesson, refresh, currentLessonId, deleteLesson, hideLesson, unhideLesson, loadMore, loading, hasNext }) => {
    const safeLessons = Array.isArray(lessons) ? lessons : [];
    const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
    const [msg, setMsg] = React.useState("");

    return (
        <>
        {loading ? <ActivityIndicator animating={true} /> :(
        <FlatList
            data={safeLessons}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={['#1565C0']} />}
            onEndReached={() => {
                if (hasNext && !loading) {
                    loadMore();
                }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
                <LessonItem lesson={item} onPressLesson={onPressLesson} currentLessonId={currentLessonId} deleteLesson={deleteLesson} hideLesson={hideLesson} unhideLesson={unhideLesson} />
            )}
            ListEmptyComponent={<Text style={{padding: 20, textAlign: 'center'}}>Chưa có bài học nào.</Text>}

        />)}
        </>
    );
};

export default LessonsView;