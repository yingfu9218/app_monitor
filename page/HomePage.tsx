import {Text, View} from 'react-native';
import {Card, Avatar, IconButton, FAB, Modal, Portal, TextInput, Button} from 'react-native-paper';
import Styles from '../Styles.tsx';
import React from 'react';
import {
  useNavigation,
} from '@react-navigation/native';
import saveConfig from '../util/LocalStorage.ts';


function HomePage(){
  const navigation = useNavigation();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [visible,setVisible]=React.useState(false);
  const [serverName,setServerName]=React.useState('');
  const [serverAddr,setServerAddr]=React.useState('');
  const [serverPort,setServerPort]=React.useState(8080);
  const [serverPro,setServerPro]=React.useState("http");
  const [serverSecretKey,setServerSecretKey]=React.useState('');
  const  serverList= [
    {"sererName": "vps","serverAddr" : "127.0.0.1","serverPort": 8080,"serverPro": "http"},
  ];
  // fab点击事件
  function fabhandle(){
    console.log("fab click");
    setVisible(true);
  }
  function cardClickHandle(){
    console.log("card click");
    navigation.navigate('DetailPage');
  }
  function saveHandle(){
    saveConfig("serverList",serverList);
    console.log("保存配置成功");
  }




  return (
   <>
   <View>
     <Card onPress={cardClickHandle}>
       <Card.Title
         title="Card Title"
         subtitle="Card Subtitle"
         left={(props) => <Avatar.Icon {...props} icon="folder" />}
         right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {console.log("修改");}} />}
       />
       <Card.Content>
         <Text variant="titleLarge">Card title</Text>
         <Text variant="bodyMedium">Card content</Text>
       </Card.Content>
     </Card>
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
         <Button mode={'outlined'} style={{margin: 10}}>
           保存
         </Button>
       </Modal>
     </Portal>
   </>
  )
}
export default HomePage;
