
import React, { useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../MyContexts";
import { MyUserReducer } from "../reducers/MyUserReducer";

export const MyUserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          dispatch({ type: "login", payload: JSON.parse(userData) }); 
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUser();
  }, []);

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