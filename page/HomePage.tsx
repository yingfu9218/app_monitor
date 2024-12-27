import {Alert, ScrollView, Text, View} from 'react-native';
import {Card, Avatar, IconButton, FAB, Modal, Portal, TextInput, Button, Switch, MD3Colors} from 'react-native-paper';
import Styles from '../Styles.tsx';
import React, {useEffect} from 'react';
import {
  useNavigation,
} from '@react-navigation/native';
import {
  addServer,
  delServerConfig,
  getAppConfig,
  resetServerList,
  ServerConfig,
  updateServerConfig,
} from '../util/appConfig.tsx';
import {getBaseInfo,CheckNenWork} from '../util/request.tsx';




function HomePage(){
  const navigation = useNavigation();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [visible,setVisible]=React.useState(false);
  const [serverName,setServerName]=React.useState('');
  const [serverAddr,setServerAddr]=React.useState('');
  const [serverPort,setServerPort]=React.useState(8080);
  const [serverSecretKey,setServerSecretKey]=React.useState('');
  const [serverList,setServerList]=React.useState([]);
  const [firstLoad,setFirstLoad]=React.useState(true);
  const [modalAdd,setModalAdd]=React.useState(true); //默认弹框为添加配置
  const [editIndex,setEditIndex]=React.useState(null); //编辑配置列表索引值
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
   * 保存配置
   */
  function saveHandle(){
    // 判断服务器是否能正常连接
    const serverConfig: ServerConfig = {
      serverName: serverName,
      serverAddr: serverAddr,
      serverPort: serverPort,
      serverSecretKey: serverSecretKey,
    };
    console.log("saveHandle");
    checkConfig(serverConfig).then((res)=>{
      console.log("检查配置信息2222" );
      console.log(res );
      if (res){
        // 判断是否为添加操作
        if (modalAdd==true){
          saveNewConfig( serverConfig );
        }else {
          saveEditConfig( serverConfig );
        }
      }else {
        Alert.alert("无法连接服务器，请核查配置或网络环境");
        return false;
      }
    }).catch((err)=>{
      console.log(err );
      Alert.alert("无法连接服务器，请核查配置或网络环境");
      return false;
    });
  }

  /**
   * 保存新配置
   */
  function saveNewConfig(serverConfig: ServerConfig) {
    addServer(serverConfig).then(() => {
      console.log('添加配置');
      setVisible(false);
      updateServerListCard();
    });
  }

  /**
   * 保存编辑配置
   */
  function saveEditConfig(serverConfig: ServerConfig) {
    updateServerConfig(editIndex,serverConfig).then(()=>{
      console.log("更新编辑配置");
      console.log(editIndex);
      console.log(serverConfig);
      setModalAdd(true);
      setVisible(false);
      updateServerListCard();
    });
  }
  /**
   * 点击编辑按钮
   * @param i
   * @param v
   */
  function editCardHandle(i,v){
    setVisible(true);
    setModalAdd(false);
    setServerName(v.serverName);
    setServerAddr(v.serverAddr);
    setServerPort(v.serverPort);
    setServerSecretKey(v.serverSecretKey);
    setEditIndex(i);
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
       checkConfigAll(list);
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
    delServerConfig(i).then(()=>{
      updateServerListCard();
    });
  }

  const checkConfig = async (serverConfig: ServerConfig) =>{
    const res = await CheckNenWork(serverConfig);
    console.log("checkConfig");
    return res.data.code == 0 ? true : false;
  };
  /**
   * 检查服务器运行状态
   */
  const checkConfigAll = async (serverListArr :ServerConfig[]) => {
    // 使用 Promise.all 来处理所有异步任务
    const newServerList = await Promise.all(
      serverListArr.map(async (v, i) => {
        const isOnline = await checkConfig(v); // 等待异步操作完成
        return { ...v, serverOnline: isOnline }; // 返回新的服务器对象
      })
    );
    setServerList(newServerList);

    console.log("aaaa"); // 打印更新后的服务器列表
    setServerList(newServerList); // 更新状态
  };


  function onDismissHandle(){
    setVisible(false);
    setModalAdd(true);
  }



  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <View>
          {/*<Button onPress={updateServerListCard}>查看配置</Button>*/}
          {/*<Button onPress={restSetHandle}>清空配置</Button>*/}
          {/*<Button onPress={()=>{navigation.navigate('AboutPage')}}>about</Button>*/}
          {/*<Button onPress={()=>{checkConfigAll();}}>检查状态</Button>*/}
          {
            serverList.length>0 && serverList.map((v,i)=>(
              <Card key={i} onPress={()=>cardClickHandle(v)}>
                <Card.Title
                  title={v.serverName}
                  subtitle={v.serverAddr}
                  left={(props) => <Avatar.Icon {...props} icon="server" />}
                  right={(props) => (
                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                      <IconButton {...props} icon={v.serverOnline ? "circle" : "alert-circle"} iconColor={v.serverOnline ? "green" : MD3Colors.error50} />
                      <IconButton {...props} icon="archive-edit" onPress={() => {editCardHandle(i,v)}} />
                      <IconButton {...props} icon="delete" onPress={() => {delCardHandle(i)}} />
                    </View>
                  )}
                />
              </Card>
            ))
          }

        </View>
        {/*添加配置弹框*/}
        <Portal>
          <Modal visible={visible} onDismiss={()=>{onDismissHandle();}} contentContainerStyle={containerStyle}>
            <Text>{ modalAdd ? "添加": "编辑" }</Text>
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

            <Button mode={'outlined'} style={{margin: 10}} onPress={saveHandle}>
              保存
            </Button>
          </Modal>
        </Portal>
      </ScrollView>
      <FAB
        icon="plus"
        style={Styles.fab}
        onPress={fabhandle}
      />
    </>
  )
}
export default HomePage;
