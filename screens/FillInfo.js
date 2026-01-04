import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MyStyles from '../styles/MyStyles';
import TextField from '../components/TextField';
import { BriefcaseBusiness, CreditCard, Landmark } from 'lucide-react-native';

const FillInfo = () => {
  const [document, setDocument] = useState(null);
  const [bankAccount, setBankAccount] = useState('');
  const [expertise, setExpertise] = useState('');

  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setDocument(result.uri);
    }
  };

  const validate = () => {
    if (!document || !bankAccount || !expertise) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return false;
    }
    return true;
  }

    const onSubmit = (data) => {
      if (validate()) {
        // Handle the submission logic here
         let form = new FormData();
         form.append('document', {
           uri: document,
           name: 'document.jpg',
           type: 'image/jpeg'
         });
         form.append('bank_account', bankAccount);
         form.append('expertise', expertise);
            console.log(form);
      }
    };

  return (
    <View style={[MyStyles.background,{ flex: 1}]}>
      <Text style={styles.title}>Đăng ký hồ sơ Giảng viên</Text>

      <Text style={styles.label}>Minh chứng xác thực <Text style={styles.required}>*</Text></Text>
      <Text style={styles.desc}>Vui lòng cung cấp minh chứng bạn là giảng viên hoặc có chuyên môn.</Text>
      <TouchableOpacity style={[styles.uploadBox,{width:'100%'}]} onPress={pickDocument}>
        {document ? (
          <Image source={{ uri: document }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.uploadText}>Chọn hoặc chụp tài liệu</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Số tài khoản ngân hàng <Text style={styles.required}>*</Text></Text>
      <TextField
        style={styles.input}
        value={bankAccount}
                left={<CreditCard />}
        onChangeText={setBankAccount}
        placeholder="Nhập số tài khoản ngân hàng"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Chuyên môn <Text style={styles.required}>*</Text></Text>
      <TextField
        style={styles.input}
        value={expertise}
left={<BriefcaseBusiness />}
        onChangeText={setExpertise}
        placeholder="Ví dụ: Toán học, Lập trình, Tiếng Anh..."
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => onSubmit({ document, bank_account: bankAccount, expertise })}
      >
        <Text style={styles.submitText}>Gửi thông tin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#2c3e50',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#34495e',
  },
  required: {
    color: '#e74c3c',
  },
  desc: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#ecf0f1',
  },
  uploadText: {
    color: '#7f8c8d',
    fontSize: 15,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  submitBtn: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default FillInfo;