import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { DollarSign, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../utils/Apis';

const screenWidth = Dimensions.get("window").width;

const PIE_COLORS = ['#1976D2', '#42A5F5', '#90CAF9', '#FFB74D', '#FF7043', '#78909C'];

const Statistic = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const loadStats = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['stats']);

            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const prepareChartData = () => {
        if (!data?.chart_data) return [];
        return data.chart_data.map(item => ({
            value: item.value,
            label: item.name.length > 10 ? item.name.substring(0, 8) + '...' : item.name, // Cắt ngắn tên nếu dài
            frontColor: '#1976D2',
            topLabelComponent: () => (
                <Text style={{ color: '#1976D2', fontSize: 10, marginBottom: 2 }}>
                    {(item.value / 1000000).toFixed(1)}M
                </Text>
            ),
        }));
    };

    if (loading && !data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1976D2" />
            </View>
        );
    }

    const preparePieData = () => {
        if (!data?.chart_data) return [];
        return data.chart_data.map((item, index) => ({
            value: item.value,
            color: PIE_COLORS[index % PIE_COLORS.length], 
            text: '',
            focused: index === 0, 
        }));
    };

    const renderLegend = () => {
        return data.chart_data.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                    marginRight: 10,
                }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#444', fontSize: 13 }} numberOfLines={1}>{item.name}</Text>
                </View>
            </View>
        ));
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadStats} />}
        >
            {/* 1. Header & Greeting */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Tổng quan</Text>
                    <Text style={styles.headerSubtitle}>Hiệu quả kinh doanh của bạn</Text>
                </View>
                <TouchableOpacity style={styles.dateFilterBtn}>
                    <Calendar size={20} color="#666" />
                    <Text style={styles.dateFilterText}>Tháng này</Text>
                </TouchableOpacity>
            </View>

            {/* 2. Key Metrics (3 Cards) */}
            <View style={styles.cardsContainer}>
                {/* Card Doanh Thu */}
                <View style={[styles.card, styles.shadow]}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <DollarSign size={24} color="#1976D2" />
                    </View>
                    <Text style={styles.cardLabel}>Tổng doanh thu</Text>
                    <Text style={styles.cardValue}>
                        {data ? formatCurrency(data.summary.total_revenue) : '0 ₫'}
                    </Text>
                </View>

                <View style={styles.rowCards}>
                    {/* Card Học viên */}
                    <View style={[styles.card, styles.halfCard, styles.shadow]}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <Users size={24} color="#2E7D32" />
                        </View>
                        <Text style={styles.cardLabel}>Học viên</Text>
                        <Text style={styles.cardValue}>{data?.summary.total_students || 0}</Text>
                    </View>

                    {/* Card Khóa học */}
                    <View style={[styles.card, styles.halfCard, styles.shadow]}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <BookOpen size={24} color="#EF6C00" />
                        </View>
                        <Text style={styles.cardLabel}>Khóa học</Text>
                        <Text style={styles.cardValue}>{data?.summary.total_courses || 0}</Text>
                    </View>
                </View>
            </View>

            {/* 3. Chart Section */}
            <View style={[styles.section, styles.shadow]}>
                <View style={styles.sectionHeader}>
                    <TrendingUp size={20} color="#1976D2" />
                    <Text style={styles.sectionTitle}>Doanh thu theo khóa học</Text>
                </View>

                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    {data?.chart_data?.length > 0 ? (
                        <BarChart
                            data={prepareChartData()}
                            barWidth={35}
                            spacing={20}
                            roundedTop
                            roundedBottom
                            hideRules
                            xAxisThickness={0}
                            yAxisThickness={0}
                            yAxisTextStyle={{ color: '#999' }}
                            noOfSections={4}
                            maxValue={Math.max(...(data?.chart_data.map(d => d.value) || [1000000])) * 1.2} // Tự động scale cột
                            height={200}
                            width={screenWidth - 60}
                            isAnimated
                        />
                    ) : (
                        <Text style={{ color: '#999', marginVertical: 30 }}>Chưa có dữ liệu doanh thu</Text>
                    )}
                </View>
            </View>


            <View style={[styles.section, styles.shadow]}>
                <View style={styles.sectionHeader}>
                    <TrendingUp size={20} color="#1976D2" />
                    <Text style={styles.sectionTitle}>Doanh thu theo khóa học</Text>
                </View>

                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    {data?.chart_data?.length > 0 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <PieChart
                                    data={preparePieData()}
                                    donut
                                    showGradient
                                    sectionAutoFocus
                                    radius={70} 
                                    innerRadius={50} 
                                    innerCircleColor={'#fff'}
                                    centerLabelComponent={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 18, color: '#1976D2', fontWeight: 'bold' }}>
                                                    {data.chart_data.length}
                                                </Text>
                                                <Text style={{ fontSize: 10, color: '#666' }}>Khóa</Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>

                            <View style={{ flex: 1, marginLeft: 20 }}>
                                {renderLegend()}
                            </View>
                        </View>
                    ) : (
                        <Text style={{ color: '#999', marginVertical: 30, textAlign: 'center' }}>
                            Chưa có dữ liệu doanh thu
                        </Text>
                    )}
                </View>
            </View>

            <View style={[styles.section, styles.shadow, { marginBottom: 30 }]}>
                <Text style={styles.sectionTitle}>Top khóa học hiệu quả</Text>

                {data?.chart_data?.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={styles.rankCircle}>
                            <Text style={styles.rankText}>{index + 1}</Text>
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${(index < 3 ? 100 - (index * 20) : 30)}%` }]} />
                            </View>
                        </View>
                        <Text style={styles.itemValue}>{formatCurrency(item.value)}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    header: {
        padding: 20,
        paddingTop: 60, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    dateFilterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    dateFilterText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        fontWeight: '600',
    },
    cardsContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    rowCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfCard: {
        width: (screenWidth - 32 - 16) / 2, // Tính toán để chia đôi màn hình
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginLeft: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    rankCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1976D2',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    itemValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1976D2',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#F0F2F5',
        borderRadius: 2,
        width: '100%',
    },
    progressBarFill: {
        height: 4,
        backgroundColor: '#1976D2',
        borderRadius: 2,
    },
});

export default Statistic;