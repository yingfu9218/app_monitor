/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import {Button, DefaultTheme, PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './page/HomePage.tsx';
import AboutPage from './page/AboutPage.tsx';
import DetailPage from './page/DetailPage.tsx';
const Stack = createNativeStackNavigator();

// 自定义浅色主题
const lightTheme = {
  ...DefaultTheme
  ,
  dark: false, // 禁用夜间模式
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee', // 自定义主色
    // background: '#ffffff', // 浅色背景
    // text: '#000000', // 浅色文本
  },
};



function App(): React.JSX.Element {
  return (
    <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomePage"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3f51b5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            // headerShown: false, // 全局隐藏导航栏
          }}>
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              title: '首页',
            }}
          />
          <Stack.Screen
            name="DetailPage"
            component={DetailPage}
            options={{
              title: '详情',
              // headerShown: true,
            }}
          />
          <Stack.Screen
            name="AboutPage"
            component={AboutPage}
            options={{
              title: '关于我们',
              // headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});

export default App;
