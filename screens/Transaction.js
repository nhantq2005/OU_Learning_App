import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { authApis, endpoints } from '../utils/Apis';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusColor = (status) => {
    switch (status) {
        case 'success': return '#2E7D32'; // Xanh lá
        case 'pending': return '#F57C00'; // Cam
        case 'failed': return '#D32F2F';  // Đỏ
        case 'canceled': return '#757575'; // Xám
        default: return '#000';
    }
};

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            let url = `${endpoints['transactions']}?limit=20&offset=${offset}&ordering=-created_date`;
            let res = await authApis(token).get(url)
            console.log("Transactions Response:", url);
            setHasNext(res.data.next !== null);

            if (offset === 0) {
                setTransactions(res.data.results);
            }
            else {
                setTransactions([...transactions, ...res.data.results]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if(offset > 0) {
        loadTransactions();
        }
    }, [offset]);

    const loadMore = () => {
        if (hasNext && !loading)
            setOffset(offset + 20);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadTransactions();
    }, []);

    if (loading && transactions.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator animating={true} color="#555" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item, idx) => String(item.id || idx)}
                renderItem={({ item }) => 
                <View style={styles.itemContainer}>
                    <View style={styles.iconBox}>
                        <Avatar.Icon
                            size={40}
                            icon={item.status === 'success' ? "check" : "history"}
                            color={getStatusColor(item.status)}
                            style={{ backgroundColor: '#F5F5F5' }}
                        />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.course?.title || "Thanh toán khóa học"}
                        </Text>
                        <Text style={styles.date}>
                            {moment(item.created_date).format('DD/MM/YYYY - HH:mm')}
                        </Text>
                    </View>

                    <View style={styles.rightContainer}>
                        <Text style={styles.amount}>
                            -{formatCurrency(item.amount)}
                        </Text>
                    </View>
                </View>}
                ItemSeparatorComponent={() => <Divider style={{ backgroundColor: '#EEE' }} />}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#000"]} />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={<Text style={styles.emptyText}>Chưa có giao dịch</Text>}
            />
        </View>
    );
};

export default Transaction;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    iconBox: {
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: '#888',
    },
    rightContainer: {
        alignItems: 'flex-end',
        minWidth: 80,
    },
    amount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    }
});