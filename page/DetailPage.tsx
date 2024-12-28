import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Alert, ScrollView, Text, View} from 'react-native';
import {VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from 'victory-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getBaseInfo, getDiskUsage} from '../util/request';
import React, {useEffect, useRef} from 'react';
import {Avatar, Button, Card, IconButton, MD3Colors, ProgressBar} from 'react-native-paper';
import Styles from '../Styles.tsx';
const Tab = createMaterialTopTabNavigator();


function BaseInfoTab({ baseInfo,diskUsage }){
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text style={Styles.baseinfoText}>主机名:  {baseInfo && baseInfo.host_info.hostname}</Text>
        <Text style={Styles.baseinfoText}>系统：   {baseInfo && baseInfo.host_info.os}</Text>
        <Text style={Styles.baseinfoText}>平台：   {baseInfo && baseInfo.host_info.platform}</Text>
        <Text style={Styles.baseinfoText}>cpu：   {baseInfo && baseInfo.cpu_info.cores}核   {baseInfo && baseInfo.cpu_info.modelName}</Text>
        <Text style={Styles.baseinfoText}>内存大小：{baseInfo && baseInfo.mem_total_str}</Text>
        <Text style={{fontSize: 28}}>磁盘空间</Text>
        {
          diskUsage.length >0 && diskUsage.map((v,i)=>(
            <View key={i} style={{margin: 12}}>
              <Text style={Styles.baseinfoText}>分区： {v.device}</Text>
              <Text style={Styles.baseinfoText}>挂载： {v.mountPoint}</Text>
              <Text style={Styles.baseinfoText}>总大小：{v.diskTotalStr}</Text>
              <Text style={Styles.baseinfoText}>已使用：{v.diskUsedStr}</Text>
              <Text style={Styles.baseinfoText}>空闲：  {v.diskFreeStr}</Text>
              <Text style={Styles.baseinfoText}>使用率：  {Math.round(v.usedPercent*100)/100}%</Text>
              <ProgressBar progress={Math.round(v.usedPercent/10)/10} color={v.usedPercent >= 80 ? MD3Colors.error50:MD3Colors.primary10} />
            </View>

          ))}
      </View>
    </ScrollView>

  );
}
function CpuInfoTab({ baseInfo,cpuPercent,cpuTimeData }){
  useEffect(() => {
    // console.log("CpuInfoTab:cpu cpuTimeData");
    // console.log(cpuTimeData);
  }, [cpuTimeData]);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        {baseInfo && <VictoryPie
          data={[
            { x: "已用", y: cpuPercent },
            { x: "空闲", y: (100-cpuPercent) },
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
    </ScrollView>
  );
}

function MemInfoTab({ baseInfo,memDetail,memPercent,menTimeData }){
  // console.log("MemInfoTab memPercent：");
  // console.log(memPercent);
  // console.log("MemInfoTab memDetail：");
  // console.log(memDetail);
  console.log("MemInfoTab menTimeData：");
  console.log(menTimeData);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        { memDetail &&  <VictoryPie
          data={[
            { x: "已用:"+memDetail.mem_used_str, y: memPercent },
            { x: "空闲:"+memDetail.mem_available_str, y: 100-memPercent },
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
    </ScrollView>
  );
}

function DiskDiskTab({ diskIOCounter }){
  // console.log("DiskSpeedTab diskIOCounter：");
  // console.log(diskIOCounter);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text>磁盘读写情况</Text>
        {diskIOCounter.length >0 && diskIOCounter.map((v,i)=>(
          // <View key={i}>
          //   <Text>分区：{v.name}</Text>
          //   <Text>读速度：{v.readSpeed}/s</Text>
          //   <Text>写速度：{v.writeSpeed}/s</Text>
          // </View>
          <Card key={i} >
            <Card.Title
              title={"分区:"+v.name}
              subtitle={"读速度："+v.readSpeed+"/s,                     写速度："+v.writeSpeed+"/s"}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}


function NetTab({ netSpeedList }){
  // console.log("NetTab DiskNetTab：");
  // console.log(netSpeedList);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text>网络请求情况</Text>
        {netSpeedList.length >0 && netSpeedList.map((v,i)=>(
          // <View key={i}>
          //   <Text>网卡：{v.name}</Text>
          //   <Text>上行：{v.uploadSpeed}/s</Text>
          //   <Text>下行：{v.downloadSpeed}/s</Text>
          // </View>
          <Card key={i} >
            <Card.Title
              title={"网卡:"+v.name}
              subtitle={"上行："+v.uploadSpeed+",                         下行："+v.downloadSpeed+""}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}


function CpuTopProcessListTab({ cpuTopProcessList }){

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text>cpu top 20</Text>
        {cpuTopProcessList.length >0 && cpuTopProcessList.map((v,i)=>(
          <Card key={i} >
            {/*<Card.Title*/}
            {/*  title={"pid:"+v.pid}*/}
            {/*  subtitle={"进程："+v.name+",      cpu使用："+v.cpuPercent+",       内存使用："+v.memPercent}*/}
            {/*/>*/}
            <Card.Content>
              <Text>pid: {v.pid}        cpu: {Math.round(v.cpuPercent*100)/100}       内存：{Math.round(v.memPercent*100)/100} </Text>
              <Text>{v.name}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
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
  const [cpuTopProcessList,setCpuTopProcessList]=React.useState([]);
  const heartBeatInterval = useRef(null);
  const wsRef=useRef(null);
  const wsUrl='wss://'+route.params.serverConfig.serverAddr+':'+route.params.serverConfig.serverPort+'/ws?token='+route.params.serverConfig.serverSecretKey;
  /**
   * websocket连接管理
   */
  const connectWebSocket = () => {
    if(!wsRef.current){
      console.log("ws 连接")
      wsRef.current = new WebSocket(wsUrl);
      wsRef.current.onopen = () => {
        // connection opened
        wsRef.current.send('something'); // send a message
      };
      wsRef.current.onmessage = e => {
        // a message was received
        // console.log(e.data);
        const messageData=JSON.parse(e.data);
        // console.log(messageData.data);
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
        // cpu前20进程
        if (mType=="cpu_top_processlist"){
          setCpuTopProcessList(cpuTopProcessList=>{
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

  };
  /**
   * 开启连接状态心跳检测
   */
  const startHeartBeat = () => {
    if (!heartBeatInterval.current) {
      heartBeatInterval.current = setInterval(() => {
        console.log("ws 心跳");
        console.log(wsRef.current);
        if(wsRef.current){
          console.log(wsRef.current.readyState);
        }
        if (wsRef.current && wsRef.current.readyState != 1) {
          wsRef.current=null;
          connectWebSocket();
        }
      }, 3000); // Send a ping every 30 seconds
    }
  };
  /**
   * 停止连接状态心跳检测
   */
  const stopHeartBeat = () => {
    if (heartBeatInterval.current) {
      clearInterval(heartBeatInterval.current);
      heartBeatInterval.current = null;
    }
  };


  connectWebSocket();
  setTimeout(() => startHeartBeat(), 3000);
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
        stopHeartBeat();
        if (wsRef.current){
          wsRef.current.close(1000,"退出链接");
          wsRef.current =null;
        }


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
      <Tab.Screen name="进程" >
        {(props) => <CpuTopProcessListTab {...props} cpuTopProcessList={cpuTopProcessList} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

export default  DetailPage;
