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
      <Text>{baseInfo && baseInfo.host_info.hostname}</Text>
      <Text>{baseInfo && baseInfo.host_info.os}</Text>
      <Text>{baseInfo && baseInfo.host_info.platform}</Text>
    </View>
  );
}
function CpuInfoTab({ baseInfo,cpuTimeData }){
  console.log("cpu cpuTimeData");
  console.log(cpuTimeData);

  return (
    <View>
      {baseInfo && <VictoryPie
        data={[
          { x: "used", y: baseInfo.cpu_used },
          { x: "free", y: (100-baseInfo.cpu_used) },
        ]}
        theme={VictoryTheme.clean}
      />


      }

      {/* <VictoryChart*/}
      {/*  theme={VictoryTheme.clean}*/}
      {/*>*/}
      {/*  <VictoryLine*/}
      {/*    data={cpuTimeData}*/}
      {/*  />*/}
      {/*</VictoryChart>*/}
    </View>
  );
}

function MemInfoTab({ baseInfo }){
  return (
    <View>
      {baseInfo && <VictoryPie
        data={[
          { x: "used:"+baseInfo.mem_used_str, y: baseInfo.mem_info.used },
          { x: "free:"+baseInfo.mem_free_str, y: baseInfo.mem_info.free },
        ]}
        theme={VictoryTheme.clean}
      />
      }
      <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryLine
          data={[
            { x: 1, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 4 },
            { x: 5, y: 7 },
          ]}
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
  const wsRef=useRef(null);

  if(!wsRef.current){
    wsRef.current = new WebSocket('ws://100.95.155.126:8004/ws');
    wsRef.current.onopen = () => {
      // connection opened
      wsRef.current.send('something'); // send a message
    };
    wsRef.current.onmessage = e => {
      // a message was received
      console.log(e.data);
      const messageData=JSON.parse(e.data);
      console.log(messageData.data);
      if (messageData.m_type=="cpu_percent"){
        const newCpuTimeData= cpuTimeData.push({x:messageData.now_time,y:messageData.data });
        setCpuTimeData(newCpuTimeData);
        // console.log(cpuTimeData);
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
        {(props) => <CpuInfoTab {...props} baseInfo={baseInfo} cpuTimeData={cpuTimeData} />}
      </Tab.Screen>
      <Tab.Screen name="Mem" >
        {(props) => <MemInfoTab {...props} baseInfo={baseInfo} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default  DetailPage;
