import {LocalStorageGet, LocalStorageSave} from './LocalStorage.tsx';

const serverListKey = 'serverList';

export interface ServerConfig {
  serverName: string;
  serverAddr: string;
  serverPort: number;
  serverIsHttps: boolean;
  serverSecretKey: string;
  serverOnline: boolean;
}

/**
 * 保存app配置
 * @param serverList
 */
export const saveAppConfig = async (serverList)=> {
  return await LocalStorageSave(serverListKey, serverList);
}

/**
 * 读取app配置
 */
export const getAppConfig = async () => {
  return await LocalStorageGet(serverListKey);

};

/**
 * 添加app配置
 * @param serverConfig
 */
export const addServer=async (serverConfig: ServerConfig)=> {
  let serverList= await getAppConfig();

  if (!serverList){
    serverList = [serverConfig];
  }else {
    serverList.push(serverConfig);
  }
  const resut=await saveAppConfig(serverList);
  return resut;

}

/**
 * 清空服务器配置列表
 */
export function resetServerList(){
  saveAppConfig([]);
}

/**
 * 删除单个服务器配置
 * @param index
 */
export const  delServerConfig= async (index:number) =>{
  const serverList= await getAppConfig();
  serverList.splice(index, 1);
  return  await saveAppConfig(serverList);
}

/**
 * 更新单个服务器配置
 * @param index
 */
export const updateServerConfig = async (index:number,serverConfig: ServerConfig)=>{
  const serverList=await getAppConfig();
  serverList[index]=serverConfig;
  await saveAppConfig(serverList);
}
