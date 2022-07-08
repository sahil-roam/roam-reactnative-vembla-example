/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  Platform
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Roam from 'roam-reactnative';
import AsyncStorage from '@react-native-async-storage/async-storage';



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [location, setLocation] = useState('')
  

  useEffect(() => {
    if(Platform.OS === 'android'){
      Roam.requestBackgroundLocationPermission()
    } else {
      Roam.requestLocationPermission()
    }
    setTimeout(() => {
      userFetch()
      Roam.offlineLocationTracking(true)
    }, 2000)
  }, [])


  const userFetch = async () => {
    try{
      const userId = await AsyncStorage.getItem('ROAM_USER')
      if(userId != null && userId != undefined){
        console.log('saved user exist')
        Roam.getUser(userId, success => {
          console.log(JSON.stringify(success))
        }, error => {
          console.log(JSON.stringify(error))
        })
      } else {
        console.log('no saved user')
        Roam.createUser('test-user', success => {
          console.log(JSON.stringify(success))
          await AsyncStorage.setItem('ROAM_USER', success.userId)
        }, error => {
          console.log(JSON.stringify(error))
        })
      }
    } catch (e){
      console.log(e)
    }
  }


  const startTracking = () => {
    Roam.publishAndSave(null)
    Roam.startListener('location', locations => {
      console.log(JSON.stringify(locations))
      setLocation(JSON.stringify(locations))
    })
    if(Platform.OS === 'android'){
      Roam.setForegroundNotification(
        true,
        "Vembla Example",
        "Tap to open",
        "mipmap/ic_launcher",
        "com.vemblaexample.MainActivity",
        "com.vemblaexample.LocationService"
      )
      Roam.startTrackingTimeInterval(5, Roam.DesiredAccuracy.HIGH);
    } else {
      Roam.startTrackingCustom(
        true,
        false,
        Roam.ActivityType.FITNESS,
        Roam.DesiredAccuracyIOS.BEST,
        true,
        0,
        50,
        5
      )
    }
  }


  const stopTracking = () => {
    if(Platform.OS === 'android'){
      Roam.setForegroundNotification(
        true,
        "Vembla Example",
        "Tap to open",
        "mipmap/ic_launcher",
        "com.vemblaexample.MainActivity",
        "com.vemblaexample.LocationService"
      )
    }
    Roam.stopTracking()
    Roam.stopListener('location')
  }

  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TouchableHighlight style={styles.button}
          onPress={() => startTracking()}
          >
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
          onPress={() => stopTracking()}
          >
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableHighlight>
          <Text style={styles.text}>Location: {location}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    margin: 50,
    width: '100%',
    height: 30,
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    textAlignVertical: 'center'
  },
  text: {
    margin: 50,
    fontSize: 16,
    color: 'blue'
  }
});

export default App;
