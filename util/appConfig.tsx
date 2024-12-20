import {LocalStorageGet, LocalStorageSave} from './LocalStorage.tsx';

const serverListKey = 'serverList';

export interface ServerConfig {
  serverName: string;
  serverAddr: string;
  serverPort: number;
  serverIsHttps: boolean;
  serverSecretKey: string;
}

/**
 * 保存app配置
 * @param serverList
 */
export const saveAppConfig=async (serverList)=> {
   const result= await LocalStorageSave(serverListKey, serverList);
   return result;
}

/**
 * 读取app配置
 */
export const getAppConfig = async () => {
  const res = await LocalStorageGet(serverListKey);
  return res;
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
export function delServerConfig(index:number){
  getAppConfig().then((serverList)=>{
    serverList.splice(index - 1, 1);
    saveAppConfig(serverList);
  });
}

/**
 * 更新单个服务器配置
 * @param index
 */
export function updateServerConfig(index:number,serverConfig: ServerConfig){
  getAppConfig().then((serverList)=>{
    serverList[index]=serverConfig;
    saveAppConfig(serverList);
  });
}
