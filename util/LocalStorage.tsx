import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存配置信息
export const LocalStorageSave = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Failed to save the config:', e);
    return  false;
  }
};


export const LocalStorageGet = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Failed to fetch the config:', e);
  }
};




