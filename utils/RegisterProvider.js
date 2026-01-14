import React, { useState } from "react";
import { RegisterContext } from "./MyContexts";

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({});

  const updateRegisterData = (newData) => {
    setRegisterData((prevData) => ({
      ...prevData, 
      ...newData,  
    }));
  };

  return (
    <RegisterContext.Provider value={{ registerData, updateRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};