import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MyStyles from '../styles/MyStyles';
import Colors from '../styles/Colors';
import Spacing from '../styles/Spacing';
import TextField from '../components/TextField';
import { Button, Card, Modal, PaperProvider, Portal } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { User, Coins, ArrowLeftCircle, CheckCircle } from 'lucide-react-native';

const Enroll = ({ route, navigation }) => {

   const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};


  // Giả sử nhận thông tin khóa học qua route.params
  const course = route?.params?.course || {
    title: 'Tên khóa học mẫu',
    description: 'Mô tả ngắn về khóa học này. Học viên sẽ được học những gì?',
    image: 'https://res.cloudinary.com/duk4u0tsp/image/upload/v1762911226/cld-sample-4.jpg',
    teacher: 'Nguyễn Văn A',
    price: 'Miễn phí',
  };
  const [note, setNote] = useState('');
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    // TODO: Gọi API đăng ký khóa học ở đây
    setEnrolled(true);
    showModal();
  };

  return (
      <View style={[MyStyles.background, { flex: 1 }]}>  
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
         {enrolled && (
          <View style={{ alignItems: 'center', marginTop: Spacing.md }}>
            <CheckCircle size={32} color={Colors.light.primary} style={{ marginBottom: 6 }} />
            <Text style={{ color: Colors.light.primary, fontWeight: 'bold', fontSize: 16 }}>
              Bạn đã đăng ký thành công!
            </Text>
          </View>
        )}
        </Modal>
      </Portal>
      {/* Header với nút back */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md, paddingHorizontal: Spacing.md }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 8 }}>
          <ArrowLeftCircle size={28} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.light.primary }}>Đăng ký khoá học</Text>
      </View>

        <Image source={{ uri: course.image }} style={styles.image} />
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.rowInfo}>
          <User color={Colors.light.secondary} size={20} style={{ marginRight: 6 }} />
          <Text style={styles.teacher}>{course.teacher}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Coins color={Colors.light.tertiary} size={20} style={{ marginRight: 6 }} />
          <Text style={styles.price}>{course.price}</Text>
        </View>
        <Text style={styles.description}>{course.description}</Text>
        <Button
          mode="contained"
          onPress={handleEnroll}
          style={styles.button}
          disabled={enrolled}
          labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
          contentStyle={{ paddingVertical: 8 }}
        >
          {enrolled ? 'Đã đăng ký' : 'Đăng ký khoá học'}
        </Button>
        





    </PaperProvider>
    </View>

    
  );
};

const styles = StyleSheet.create({
  card: {
    margin: Spacing.lg,
    borderRadius: 18,
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    elevation: 4,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    justifyContent: 'center',
  },
  teacher: {
    fontSize: 16,
    color: Colors.light.secondary,
  },
  price: {
    fontSize: 16,
    color: Colors.light.tertiary,
  },
  description: {
    fontSize: 15,
    color: Colors.light.onBackground,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    borderRadius: 16,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
});

export default Enroll;
