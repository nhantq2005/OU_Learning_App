import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import Colors from '../styles/Colors';
import Spacing from '../styles/Spacing';

const mockStudent = {
	avatar: 'https://i.pravatar.cc/150?img=12',
	name: 'Nguyễn Văn A',
	major: 'Công nghệ thông tin',
	birthYear: 2003,
	courses: [
		{ id: 1, title: 'Lập trình Python', image: 'https://i.imgur.com/1bX5QH6.jpg' },
		{ id: 2, title: 'Cơ sở dữ liệu', image: 'https://i.imgur.com/1bX5QH6.jpg' },
		{ id: 3, title: 'Thiết kế Web', image: 'https://i.imgur.com/1bX5QH6.jpg' },
	]
};

const StudentProfile = () => {
	const [student] = useState(mockStudent);

	return (
		<ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
			<View style={styles.container}>
				{/* Avatar & Name */}
				<View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
					<Image source={{ uri: student.avatar }} style={styles.avatar} />
					<Text style={styles.name}>{student.name}</Text>
					<Text style={styles.major}>{student.major}</Text>
					<Text style={styles.birthYear}>Năm sinh: {student.birthYear}</Text>
				</View>
				<Divider style={{ marginBottom: Spacing.md }} />

				{/* Chat with Teacher */}
				<Card style={styles.chatBox}>
					<Card.Title title="Chat với giảng viên" />
					<Card.Content>
						<Text style={{ color: '#555' }}>Bạn có thể gửi tin nhắn cho giảng viên tại đây.</Text>
						<Button mode="contained" style={styles.chatButton} onPress={() => {}}>
							Mở chat
						</Button>
					</Card.Content>
				</Card>

				<Divider style={{ marginVertical: Spacing.md }} />

				{/* Course List */}
				<Text style={styles.sectionTitle}>Danh sách bài giảng</Text>
				<View>
					{student.courses.map(course => (
						<TouchableOpacity key={course.id} style={styles.courseItem}>
							<Image source={{ uri: course.image }} style={styles.courseImage} />
							<Text style={styles.courseTitle}>{course.title}</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 18,
	},
	avatar: {
		width: 110,
		height: 110,
		borderRadius: 55,
		marginBottom: 12,
		borderWidth: 2,
		borderColor: Colors.light.primary,
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.primary,
		marginBottom: 4,
	},
	major: {
		fontSize: 16,
		color: '#555',
		marginBottom: 2,
	},
	birthYear: {
		fontSize: 15,
		color: '#888',
		marginBottom: 8,
	},
	chatBox: {
		marginBottom: Spacing.md,
		backgroundColor: '#fff',
		elevation: 2,
		borderRadius: 12,
	},
	chatButton: {
		marginTop: 10,
		borderRadius: 8,
		backgroundColor: Colors.light.primary,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		color: Colors.light.primary,
	},
	courseItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		elevation: 1,
	},
	courseImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
		marginRight: 12,
	},
	courseTitle: {
		fontSize: 16,
		color: '#333',
		fontWeight: '500',
	},
});

export default StudentProfile;