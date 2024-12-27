import axios from'axios';
import {ServerConfig} from './appConfig';



function getRequestBaseUrl(serverConfig: ServerConfig){
  return  "https://"+serverConfig.serverAddr+":"+serverConfig.serverPort
}

/**
 * 检查网络连通性
 * @param serverConfig
 */
export const CheckNenWork= async (serverConfig: ServerConfig)=>{
  const path="/";
  const requestUrl=getRequestBaseUrl(serverConfig)+path
  return await axios.get(requestUrl,{
    headers: {
      'secret-key': serverConfig.serverSecretKey
    },
    timeout: 2000,
  })
}

/**
 * 获取基本信息
 * @param serverConfig
 */
export const getBaseInfo= async (serverConfig: ServerConfig)=>{
  const path="/api/baseinfo";
  const requestUrl=getRequestBaseUrl(serverConfig)+path
  return await axios.get(requestUrl,{
    headers: {
      'secret-key': serverConfig.serverSecretKey
    },
  })
}
/**
 * 获取磁盘使用情况
 * @param serverConfig
 */
export const getDiskUsage= async (serverConfig: ServerConfig)=>{
  const path="/api/diskUsage";
  const requestUrl=getRequestBaseUrl(serverConfig)+path
  return await axios.get(requestUrl,{
    headers: {
      'secret-key': serverConfig.serverSecretKey
    }
  })
}



