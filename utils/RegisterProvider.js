import React, { useState } from "react";
import { RegisterContext } from "./MyContexts";

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({});

  // Hàm cập nhật dữ liệu (giữ lại dữ liệu cũ, chỉ ghi đè dữ liệu mới)
  const updateRegisterData = (newData) => {
    setRegisterData((prevData) => ({
      ...prevData, // Giữ lại các trường cũ (ví dụ username đã nhập ở màn 1)
      ...newData,  // Ghi đè hoặc thêm trường mới
    }));
  };

  return (
    <RegisterContext.Provider value={{ registerData, updateRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};