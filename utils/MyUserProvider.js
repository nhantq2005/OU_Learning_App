
import React, { useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "./MyContexts";
import { MyUserReducer } from "./reducers/MyUserReducer";

export const MyUserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  // Load user từ AsyncStorage khi app khởi động
useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          // SỬA "LOGIN" -> "login" cho khớp với Reducer
          dispatch({ type: "login", payload: JSON.parse(userData) }); 
        }
      } catch (e) {
        // Xử lý lỗi
      }
    };
    loadUser();
  }, []);

  // Lưu user vào AsyncStorage khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
    };
    saveUser();
  }, [user]);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      {children}
    </MyUserContext.Provider>
  );
};