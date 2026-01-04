
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, Switch, Card, Divider } from 'react-native-paper';
import TextField from '../components/TextField';
import MyStyles from '../styles/MyStyles';
import Colors from '../styles/Colors';
import Spacing from '../styles/Spacing';
import { ArrowLeftCircle, Book, Coins, Delete, ImageDownIcon, ImagePlusIcon, LetterText, MenuSquare, ShieldUser, Tag, Video, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Apis, { endpoints } from '../utils/Apis';
import { MyUserProvider } from '../utils/MyUserProvider';
import { MyUserContext } from '../utils/MyContexts';

const EditCourse = () => {
    
};