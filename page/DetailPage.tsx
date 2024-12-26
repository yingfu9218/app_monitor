import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Alert, Text, View} from 'react-native';
import {VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from 'victory-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getBaseInfo, getDiskUsage} from '../util/request';
import React, {useEffect, useRef} from 'react';
import {Button, MD3Colors, ProgressBar} from 'react-native-paper';
const Tab = createMaterialTopTabNavigator();
const labTextStyle= {fontSize:25};

function BaseInfoTab({ baseInfo,diskUsage }){
  return (
    <View style={labTextStyle}>
      <Text>主机名:  {baseInfo && baseInfo.host_info.hostname}</Text>
      <Text>系统：   {baseInfo && baseInfo.host_info.os}</Text>
      <Text>平台：   {baseInfo && baseInfo.host_info.platform}</Text>
      <Text>cpu：   {baseInfo && baseInfo.cpu_info.cores}核   {baseInfo && baseInfo.cpu_info.modelName}</Text>
      <Text>内存大小：{baseInfo && baseInfo.mem_total_str}</Text>
      <Text style={{fontSize: 25}}>磁盘空间</Text>
      {
        diskUsage.length >0 && diskUsage.map((v,i)=>(
          <View key={i}>
            <Text>分区： {v.device}</Text>
            <Text>挂载： {v.mountPoint}</Text>
            {/*<Text>总大小：{v.diskTotalStr}</Text>*/}
            {/*<Text>已使用：{v.diskUsedStr}</Text>*/}
            {/*<Text>空闲：  {v.diskFreeStr}</Text>*/}
            <ProgressBar progress={0.5} color={MD3Colors.error50} />
          </View>

        ))}
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
  console.log("MemInfoTab menTimeData：");
  console.log(menTimeData);
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

function DiskDiskTab({ diskIOCounter }){
  console.log("DiskSpeedTab diskIOCounter：");
  console.log(diskIOCounter);
  return (
    <View>
      <Text>磁盘读写情况</Text>
      {diskIOCounter.length >0 && diskIOCounter.map((v,i)=>(
        <View>
          <Text>分区：{v.name}</Text>
          <Text>读速度：{v.readSpeed}/s</Text>
          <Text>写速度：{v.writeSpeed}/s</Text>
        </View>
      ))}
    </View>
  );
}

function NetTab({ netSpeedList }){
  console.log("NetTab DiskNetTab：");
  console.log(netSpeedList);
  return (
    <View>
      <Text>网络请求情况</Text>
      {netSpeedList.length >0 && netSpeedList.map((v,i)=>(
        <View key={i}>
          <Text>网卡：{v.name}</Text>
          <Text>上行：{v.uploadSpeed}/s</Text>
          <Text>下行：{v.downloadSpeed}/s</Text>
        </View>
      ))}
    </View>
  );
}



function DetailPage({ route }){
  const navigation = useNavigation();
  const [baseInfo,setBaseInfo]=React.useState(null);
  const [diskUsage,setDiskUsage]=React.useState([]);
  const [cpuTimeData,setCpuTimeData]=React.useState([]);
  const [firstLoad,setFirstLoad]=React.useState(true);
  const [cpupercent,setCpupercent]=React.useState(0.0);
  const [memDatail,setMemDatail]=React.useState(null);
  const [memPercent,setMemPercent]=React.useState(0.0);
  const [memTimeData,setMemTimeData]=React.useState([]);
  const [diskIOCounter,setDiskIOCounter]=React.useState([]);
  const [netSpeedList,setNetSpeedList]=React.useState([]);
  const wsRef=useRef(null);
  const wsUrl='wss://'+route.params.serverConfig.serverAddr+':'+route.params.serverConfig.serverPort+'/ws?token='+route.params.serverConfig.serverSecretKey;
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
      // 更新磁盘读写信息
      if (mType=="disk_io_counters"){
        setDiskIOCounter(diskIOCounter=>{
          return  messageData.data;
        });
      }
      // 更新网络请求信息
      if (mType=="net_speed_list"){
        setNetSpeedList(netSpeedList=>{
          return  messageData.data;
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
    getDiskUsage(route.params.serverConfig).then((res)=>{
      console.log(res.data);
      setDiskUsage(res.data.data);
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
        {(props) => <BaseInfoTab {...props} baseInfo={baseInfo} diskUsage={diskUsage} />}
      </Tab.Screen>
      <Tab.Screen name="cpu"  >
        {(props) => <CpuInfoTab {...props} baseInfo={baseInfo} cpuPercent={cpupercent} cpuTimeData={cpuTimeData} />}
      </Tab.Screen>
      <Tab.Screen name="内存" >
        {(props) => <MemInfoTab {...props} baseInfo={baseInfo} memDetail={memDatail} memPercent={memPercent} menTimeData={memTimeData} />}
      </Tab.Screen>
      <Tab.Screen name="io" >
        {(props) => <DiskDiskTab {...props} diskIOCounter={diskIOCounter} />}
      </Tab.Screen>
      <Tab.Screen name="网络" >
        {(props) => <NetTab {...props} netSpeedList={netSpeedList} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default  DetailPage;
