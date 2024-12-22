import axios from'axios';
import {ServerConfig} from './appConfig';



function getRequestBaseUrl(serverConfig: ServerConfig){
  const pro= serverConfig.serverIsHttps ? "https": "http"
  return  pro+"://"+serverConfig.serverAddr+":"+serverConfig.serverPort
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
    }
  })
}
