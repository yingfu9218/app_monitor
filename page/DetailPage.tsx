import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Alert, Text, View} from 'react-native';
import {VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from 'victory-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getBaseInfo} from '../util/request';
import React, {useEffect, useRef} from 'react';
import {Button} from 'react-native-paper';
const Tab = createMaterialTopTabNavigator();


function BaseInfoTab({ baseInfo }){
  return (
    <View>
      <Text>主机名:  {baseInfo && baseInfo.host_info.hostname}</Text>
      <Text>系统：   {baseInfo && baseInfo.host_info.os}</Text>
      <Text>平台：   {baseInfo && baseInfo.host_info.platform}</Text>
      <Text>内存大小：{baseInfo && baseInfo.mem_total_str}</Text>
    </View>
  );
}
function CpuInfoTab({ baseInfo,cpuPercent,cpuTimeData }){
  useEffect(() => {
    console.log("CpuInfoTab:cpu cpuTimeData");
    console.log(cpuTimeData);
  }, [cpuTimeData]);
  return (
    <View>
      {baseInfo && <VictoryPie
        data={[
          { x: "used", y: cpuPercent },
          { x: "free", y: (100-cpuPercent) },
        ]}
        theme={VictoryTheme.clean}
      />


      }

       <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryLine
          data={cpuTimeData}
        />
      </VictoryChart>
    </View>
  );
}

function MemInfoTab({ baseInfo,memDetail,memPercent,menTimeData }){
  console.log("MemInfoTab memPercent：");
  console.log(memPercent);
  console.log("MemInfoTab memDetail：");
  console.log(memDetail);
  return (
    <View>
      { memDetail &&  <VictoryPie
        data={[
          { x: "used:"+memDetail.mem_used_str, y: memPercent },
          { x: "free:"+memDetail.mem_free_str, y: 100-memPercent },
        ]}
        theme={VictoryTheme.clean}
      />}
      <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryLine
          data={menTimeData}
        />
      </VictoryChart>
    </View>
  );
}


function DetailPage({ route }){
  const navigation = useNavigation();
  const [baseInfo,setBaseInfo]=React.useState(null);
  const [cpuTimeData,setCpuTimeData]=React.useState([]);
  const [firstLoad,setFirstLoad]=React.useState(true);
  const [cpupercent,setCpupercent]=React.useState(0.0);
  const [memDatail,setMemDatail]=React.useState(null);
  const [memPercent,setMemPercent]=React.useState(0.0);
  const [memTimeData,setMemTimeData]=React.useState([]);
  const wsRef=useRef(null);
  const wsUrl='ws://'+route.params.serverConfig.serverAddr+':'+route.params.serverConfig.serverPort+'/ws';
  if(!wsRef.current){
    wsRef.current = new WebSocket(wsUrl);
    wsRef.current.onopen = () => {
      // connection opened
      wsRef.current.send('something'); // send a message
    };
    wsRef.current.onmessage = e => {
      // a message was received
      console.log(e.data);
      const messageData=JSON.parse(e.data);
      console.log(messageData.data);
      // 消息类型
      const mType=messageData.m_type;
      // 更新cpu使用率信息
      if (mType=="cpu_percent"){
        setCpupercent(messageData.data);
        const addCpuData = { x: messageData.now_time.split(" ")[1], y: messageData.data };
        setCpuTimeData(cpuTimeData => {
          let oldcpuTimeData=cpuTimeData;
          if (oldcpuTimeData.length> 6){
            oldcpuTimeData=oldcpuTimeData.splice(-5);
          }
          return [
            ...oldcpuTimeData,
            addCpuData,
          ];
        });

      }
      // 更新内存使用率信息
      if (mType=="mem_datail"){
        setMemDatail(memDatail=>{
          return messageData.data;
        });
        let newMemPercent=(messageData.data.mem_info.used/messageData.data.mem_info.total)*100;
        newMemPercent=Math.round(newMemPercent*100)/100;
        const addMemData = { x: messageData.now_time.split(" ")[1], y: newMemPercent };
        setMemPercent(newMemPercent);
        setMemTimeData(memTimeData => {
          let oldMemTimeData=memTimeData;
          if (oldMemTimeData.length> 6){
            oldMemTimeData=oldMemTimeData.splice(-5);
          }
          return [
            ...oldMemTimeData,
            addMemData,
          ];
        });

      }
    };
    wsRef.current.onerror = e => {
      // an error occurred
      console.log(e.message);
    };
    wsRef.current.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
      console.log("触发onclose ");
    };
  }
  console.log("初始1111");
  if(firstLoad==true){
    getBaseInfo(route.params.serverConfig).then((res)=>{
      console.log(res.data);
      setBaseInfo(res.data.data);
    });
    setFirstLoad(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen is focused');

      return () => {
        console.log('Screen is unfocused');
        // 这里可以清理定时器或取消订阅等操作
        console.log("退出页面");
        wsRef.current.close(1000,"退出链接");
      };
    }, [])
  );
  return (
    <Tab.Navigator>
      <Tab.Screen name="概况" >
        {(props) => <BaseInfoTab {...props} baseInfo={baseInfo} />}
      </Tab.Screen>
      <Tab.Screen name="cpu"  >
        {(props) => <CpuInfoTab {...props} baseInfo={baseInfo} cpuPercent={cpupercent} cpuTimeData={cpuTimeData} />}
      </Tab.Screen>
      <Tab.Screen name="内存" >
        {(props) => <MemInfoTab {...props} baseInfo={baseInfo} memDetail={memDatail} memPercent={memPercent} menTimeData={memTimeData} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default  DetailPage;
