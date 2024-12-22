import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Alert, Text, View} from 'react-native';
import {VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from 'victory-native';
import {useNavigation} from '@react-navigation/native';
import {getBaseInfo} from '../util/request';
import React from 'react';
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

      {cpuTimeData.length >0 && <VictoryChart
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

      }
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
  console.log("初始1111");
  React.useEffect(() => {
    console.log("初始2222222");
    if(firstLoad==true){
      getBaseInfo(route.params.serverConfig).then((res)=>{
        console.log(res.data);
        setBaseInfo(res.data.data)
        // const intervalId =setInterval(()=>timeCronHandle(res.data.data),5000);
        // return ()=>{clearInterval(intervalId); }
      });
      setFirstLoad(false);
    }
  });
  function timeCronHandle(newData){

    const addCpuData={x: 'a',y:newData.cpu_used}
    const newItem=cpuTimeData;
    newItem.push(addCpuData);
    setCpuTimeData(newItem)
    console.log("time interval ");
    console.log(cpuTimeData);
  }

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

export default DetailPage;
