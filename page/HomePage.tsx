import {Text, View} from 'react-native';
import {Card, Avatar, IconButton, FAB, Modal, Portal, TextInput, Button, Switch} from 'react-native-paper';
import Styles from '../Styles.tsx';
import React, {useEffect} from 'react';
import {
  useNavigation,
} from '@react-navigation/native';
import {addServer, delServerConfig, getAppConfig, resetServerList, ServerConfig} from '../util/appConfig.tsx';




function HomePage(){
  const navigation = useNavigation();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [visible,setVisible]=React.useState(false);
  const [serverName,setServerName]=React.useState('');
  const [serverAddr,setServerAddr]=React.useState('');
  const [serverPort,setServerPort]=React.useState(8080);
  const [serverIsHttps,setserverIsHttps]=React.useState(false);
  const [serverSecretKey,setServerSecretKey]=React.useState('');
  const [serverList,setServerList]=React.useState([]);
  const [firstLoad,setFirstLoad]=React.useState(true);
  // const [cardEle,setCardEle]=React.useState(null);
  React.useEffect(()=>{
    if(firstLoad==true){
      updateServerListCard();
      setFirstLoad(false);
    }
  });
  // fab点击事件
  function fabhandle(){
    console.log("fab click");
    setVisible(true);
  }

  /**
   * 点击卡片
   */
  function cardClickHandle(v){
    console.log("card click");
    navigation.navigate('DetailPage',{ serverConfig: v });
  }

  /**
   * 保存新增配置
   */
  function saveHandle(){
    const serverConfig: ServerConfig={
      serverName: serverName,
      serverAddr: serverAddr,
      serverIsHttps: serverIsHttps,
      serverPort: serverPort,
      serverSecretKey: serverSecretKey,
    };
    addServer(serverConfig).then(()=>{
      console.log("添加配置");
      setVisible(false);
      updateServerListCard();
    });

  }

  /**
   * 刷新配置
   */
  function updateServerListCard(){
     getAppConfig().then((list)=>{
       console.log("获取app配置");
       console.log(list);
      if (list==null){
        setServerList([]);
      }else {
        setServerList(list);
      }

     });
  }

  /**
   * 重置配置
   */
  function restSetHandle(){
    resetServerList();
    updateServerListCard();
  }

  /**
   * 删除配置
   * @param v
   * @param i
   */
  function  delCardHandle(i){
    console.log(i);
    delServerConfig(i).then(()=>{
      updateServerListCard();
    });
  }




  return (
   <>
   <View>
     <Button onPress={updateServerListCard}>查看配置</Button>
     <Button onPress={restSetHandle}>清空配置</Button>
     {
       serverList.length>0 && serverList.map((v,i)=>(
         <Card key={i} onPress={()=>cardClickHandle(v)}>
           <Card.Title
             title={v.serverName}
             subtitle={v.serverAddr}
             left={(props) => <Avatar.Icon {...props} icon="server" />}
             right={(props) => <IconButton {...props} icon="delete" onPress={() => {delCardHandle(i)}} />}
           />
         </Card>
       ))
     }

   </View>
     <FAB
       icon="plus"
       style={Styles.fab}
       onPress={fabhandle}
     />
     {/*添加配置弹框*/}
     <Portal>
       <Modal visible={visible} onDismiss={()=>{setVisible(false)}} contentContainerStyle={containerStyle}>
         <Text>添加配置</Text>
         <TextInput
           label="名称"
           value={serverName}
           mode="outlined"
           onChangeText={text => setServerName(text)}
           style={{margin: 6}}
         />
         <TextInput
           label="地址"
           value={serverAddr}
           mode="outlined"
           onChangeText={text => setServerAddr(text)
         }
           style={{margin: 6}}
         />
         <TextInput
           label="端口"
           value={serverPort}
           mode="outlined"
           onChangeText={text => setServerPort(text)}
           style={{margin: 6}}
         />
         <TextInput
           label="密钥"
           value={serverSecretKey}
           mode="outlined"
           onChangeText={text => setServerSecretKey(text)}
           style={{margin: 6}}
         />
         <View>
           <Text>启用https</Text>
           <Switch value={serverIsHttps} onValueChange={(val)=>setserverIsHttps(!serverIsHttps)} ></Switch>
         </View>

         <Button mode={'outlined'} style={{margin: 10}} onPress={saveHandle}>
           保存
         </Button>
       </Modal>
     </Portal>
   </>
  )
}
export default HomePage;
