import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import moment from 'moment'; 

const Review = ({ avatar, name, content, date }) => (
  <Card style={styles.card}>
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.contentBox}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.date}>{moment(date).format("DD/MM/YYYY HH:mm")}</Text> 
      </View>
    </View>
  </Card>
);

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
});

export default Review;


