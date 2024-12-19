import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Text, View} from 'react-native';
import {VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from 'victory-native';
const Tab = createMaterialTopTabNavigator();


function BaseInfo(){
  return (
    <Text>baseinfo</Text>
  );
}
function CpuInfo(){
  return (
    <View>
      <VictoryPie
        data={[
          { x: "Cats", y: 35 },
          { x: "Dogs", y: 40 },
          { x: "Birds", y: 55 },
        ]}
        theme={VictoryTheme.clean}
      />
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

function MemInfo(){
  return (
    <View>
      <VictoryPie
        data={[
          { x: "Cats", y: 35 },
          { x: "Dogs", y: 40 },
          { x: "Birds", y: 55 },
        ]}
        theme={VictoryTheme.clean}
      />
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


function Network(){
  return (
    <View>
      <Text>network</Text>
    </View>
  );
}
function ProcessList(){
  return (
    <View>
      <Text>Process</Text>
    </View>
  );
}

function DetailPage(){
  return (
    <Tab.Navigator>
      <Tab.Screen name="概况" component={BaseInfo} />
      <Tab.Screen name="cpu" component={CpuInfo} />
      <Tab.Screen name="Mem" component={MemInfo} />
      <Tab.Screen name="Network" component={Network} />
      <Tab.Screen name="Process" component={ProcessList} />
    </Tab.Navigator>
  );
}

export default DetailPage;
