import { ServiceCard } from '../components/ServiceCard';
import React, { useCallback, useEffect, useState } from 'react';
import { Service } from 'react-native-ble-plx';
import { RootStackParamList } from '../navigation/index';
import { StackScreenProps } from '@react-navigation/stack';
import { Text, ScrollView, Button, View, StyleSheet,TextInput,Dimensions } from 'react-native';
import FilePickerManager from 'react-native-file-picker';

let width = Dimensions.get('window').width; 
let height = Dimensions.get('window').height;










const DeviceScreen = ({route,navigation,}: StackScreenProps<RootStackParamList, 'Device'>) => {

  const { device } = route.params;
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const disconnectDevice = useCallback(async () => {
    navigation.goBack();
    const isDeviceConnected = await device.isConnected();
    if (isDeviceConnected) {
      await device.cancelConnection();
    }
  }, [device, navigation]);

  const [file, setFile] = useState("NO File Selected");

  useEffect(() => {
    const getDeviceInformations = async () => {
      // connect to the device
      const connectedDevice = await device.connect();
      setIsConnected(true);

      // discover all device services and characteristics
      const allServicesAndCharacteristics = await connectedDevice.discoverAllServicesAndCharacteristics();
      // get the services only
      const discoveredServices = await allServicesAndCharacteristics.services();
      setServices(discoveredServices);
    };

    getDeviceInformations();

    device.onDisconnected(() => {
      navigation.navigate('Home');
    });



    // give a callback to the useEffect to disconnect the device when we will leave the device screen
    return () => {
      disconnectDevice();
    };
  }, [device, disconnectDevice, navigation]);

  function FilePICK(){
  const options = {
    title: 'File Picker',
    chooseFileButtonTitle: 'Choose File...'
  };

  FilePickerManager.showFilePicker(options, (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled photo picker');
    }
    else if (response.error) {
      console.log('ImagePickerManager Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      setFile(response.path);
    }

  });
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="disconnect" onPress={disconnectDevice} style={{padding:10}} />
      <View style={{paddingTop:20}}>
        <View style={styles.header}>
          <Text>{`Id : ${device.id}`}</Text>
          <Text>{`Name : ${device.name}`}</Text>
          <Text>{`Is connected : ${isConnected}`}</Text>
          <Text>{`RSSI : ${device.rssi}`}</Text>
          <Text>{`Manufacturer : ${device.manufacturerData}`}</Text>
          <Text>{`ServiceData : ${device.serviceData}`}</Text>
          <Text>{`UUIDS : ${device.serviceUUIDs}`}</Text>
        </View>
        {/*<View style={{alignItems:"center",display:"flex"}}>

        <TextInput placeholder={"Send Data to Arduino"} style={styles.input}/>
        </View>*/}

        <View style={{padding:10}}  >
          <Button title="Select File" onPress={FilePICK.bind(setFile)} style={{padding:10}} />
        </View>
        <Text style={{color:"black",textAlign:"center"}}>{file}</Text>
        <View style={{padding:10}}  >
        <Button title="Send"  style={{padding:10}} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  input:{
        color:"black",
        backgroundColor:"#162325",
        borderWidth: 2,
        borderRadius: 10,
        borderColor:"yellowgreen",
        width:width-20,
        height:200,
        color:"white",
        textAlign:"center",
        paddingBottom:20
    },
  header: {
    backgroundColor: 'teal',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { DeviceScreen };
