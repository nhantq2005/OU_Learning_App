import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text, TextInput, Divider } from "react-native-paper";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Calendar, Clock, RotateCcw } from "lucide-react-native";

const { width } = Dimensions.get('window');

const BottomSheet = ({ filter, setFilter }) => {

    if (!filter) return null;

    const updateFilter = (key, value) => {
        setFilter(current => ({ ...current, [key]: value }));
    }

    const isValidNumber = (val) => val === '' || /^[0-9]+$/.test(val);

    const SortItem = ({ label, value, icon: Icon, currentValue }) => {
        const isSelected = currentValue === value;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => updateFilter('ordering', value)}
                style={[
                    styles.sortItem,
                    isSelected && styles.sortItemActive
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon 
                        size={18} 
                        color={isSelected ? "#1976D2" : "#64748B"} 
                        strokeWidth={2.5}
                    />
                    <Text style={[
                        styles.sortLabel,
                        isSelected && styles.sortLabelActive
                    ]}>
                        {label}
                    </Text>
                </View>
                
                <View style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleActive
                ]}>
                    {isSelected && <View style={styles.radioDot} />}
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.handleBarContainer}>
                <View style={styles.handleBar} />
            </View>

            <View style={styles.headerRow}>
                <Text style={styles.title}>Bộ lọc & Sắp xếp</Text>
                <TouchableOpacity onPress={() => setFilter({ ...filter, min_price: '', max_price: '', ordering: '-created_date' })}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <RotateCcw size={14} color="#64748B"/>
                        <Text style={{color: '#64748B', fontSize: 13, fontWeight: '600'}}>Đặt lại</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <Divider style={{marginBottom: 20, backgroundColor: '#E2E8F0'}} />

            <Text style={styles.sectionTitle}>Khoảng giá (VNĐ)</Text>
            <View style={styles.priceRow}>
                <TextInput
                    value={filter.min_price}
                    onChangeText={(t) => updateFilter('min_price', t)}
                    placeholder="0"
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    activeOutlineColor="#1976D2"
                    textColor="#1E293B"
                    right={<TextInput.Affix text="đ" textStyle={{color: '#94A3B8'}}/>}
                    error={!isValidNumber(filter.min_price)}
                />
                <View style={styles.dash} />
                <TextInput
                    value={filter.max_price}
                    onChangeText={(t) => updateFilter('max_price', t)}
                    placeholder="Max"
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    activeOutlineColor="#1976D2"
                    textColor="#1E293B"
                    right={<TextInput.Affix text="đ" textStyle={{color: '#94A3B8'}}/>}
                    error={!isValidNumber(filter.max_price)}
                />
            </View>

            <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
            <View style={styles.sortGrid}>
                <SortItem 
                    label="Mới nhất" 
                    value="-created_date" 
                    icon={Calendar} 
                    currentValue={filter.ordering} 
                />
                <SortItem 
                    label="Cũ nhất" 
                    value="created_date" 
                    icon={Clock} 
                    currentValue={filter.ordering} 
                />
                <SortItem 
                    label="Giá thấp - cao" 
                    value="price" 
                    icon={ArrowUpNarrowWide} 
                    currentValue={filter.ordering} 
                />
                <SortItem 
                    label="Giá cao - thấp" 
                    value="-price" 
                    icon={ArrowDownWideNarrow} 
                    currentValue={filter.ordering} 
                />
            </View>

        </View>
    );
}

export default BottomSheet;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '100%',
    },
    handleBarContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155', 
        marginBottom: 12,
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        fontSize: 15,
        height: 44,
    },
    inputOutline: {
        borderRadius: 12,
        borderColor: '#CBD5E1',
    },
    dash: {
        width: 10,
        height: 2,
        backgroundColor: '#94A3B8',
        marginHorizontal: 12,
    },
    sortGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sortItem: {
        width: (width - 48 - 12) / 2, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        backgroundColor: '#fff',
    },
    sortItemActive: {
        borderColor: '#1976D2',
        backgroundColor: '#F0F7FF', 
    },
    sortLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    sortLabelActive: {
        color: '#1976D2',
        fontWeight: '700',
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleActive: {
        borderColor: '#1976D2',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1976D2',
    },
});