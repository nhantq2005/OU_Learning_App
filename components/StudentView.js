import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Avatar, ProgressBar, Card } from 'react-native-paper';
import { authApis, endpoints } from '../utils/Apis';

const StudentView = ({ courseId }) => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProgressColor = (process_percent) => {
    if (process_percent >= 100) return '#4CAF50'; 
    if (process_percent > 0) return '#1976D2';    
    return '#E0E0E0';                          
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await authApis(token).get(endpoints['course_students'](courseId));
      setStudents(res.data);
    }
    catch (error) {
      setLoading(false);
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadStudents();
    } 
  }, [courseId]);

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card style={styles.card} mode="elevated" elevation={1}>
          <View style={styles.container}>
            {/* --- A. AVATAR --- */}
            <View style={styles.avatarContainer}>
              {item.avatar ? (
                <Avatar.Image
                  size={50}
                  source={{ uri: item.avatar }}
                  style={{ backgroundColor: '#fff' }}
                />
              ) : (
                <Avatar.Text
                  size={50}
                  label={item.first_name?.charAt(0).toUpperCase() || "U"}
                  style={{ backgroundColor: '#BBDEFB' }}
                  color="#1565C0"
                />
              )}
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={[styles.percentText, { color: getProgressColor(item.process_percent) }]}>
                  {item.process_percent}%
                </Text>
              </View>

              <Text style={styles.email} numberOfLines={1}>{item.email}</Text>

              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={item.process_percent/100}
                  color={getProgressColor(item.process_percent)}
                  style={styles.progressBar}
                />
              </View>

              {item.completed_count !== undefined && (
                <Text style={styles.lessonsCount}>
                  Đã hoàn thành: {item.completed_count} bài
                </Text>
              )}
            </View>
          </View>
        </Card>
      )} />

  );
};

export default StudentView;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5', 
  },
  lessonsCount: {
    marginTop: 6,
    fontSize: 11,
    color: '#9E9E9E',
    fontStyle: 'italic'
  }
});