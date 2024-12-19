import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存配置信息
const saveConfig = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save the config:', e);
  }
};

// 获取配置信息
const getConfig = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Failed to fetch the config:', e);
  }
};
export default saveConfig;
export default getConfig;
