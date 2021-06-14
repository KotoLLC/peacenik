/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef} from 'react';
import {StyleSheet, SafeAreaView, Platform, Linking} from 'react-native';
import WebView from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import CookieManager from '@react-native-community/cookies';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';

import {fcmService} from  './fcm/FCMService'
import {localNotificationService} from './fcm/LocalNotificationService'

const url = 'https://peacenik.app';
const inAppUrls = [
  url,
  'https://www.youtube.com',
  'https://youtube.com',
  'https://m.youtube.com'
];

const App = () => {
  let token = null;
  const webview = useRef(null);

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      console.log("[App] onRegister: ", token);
      registerTokenToServer(token)
    }

    function onNotification(notify) {
      console.log("[App] onNotification: ", notify);
      const options = {
        soundName: 'default',
        playSound: true
      }
      localNotificationService.showNotification(
          0,
          notify.title,
          notify.body,
          notify,
          options
      )
    }

    function onOpenNotification(notify) {
        console.log("[App] onOpenNotification: ", notify);
    }

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });

    SplashScreen.hide();

    return () => {
        console.log("[App] unRegister");
        fcmService.unRegister();
        localNotificationService.unregister();
    }
   
  }, [])

  const onMessage = (event) => {
    const {data} = event.nativeEvent;
    console.log('[REACTNATIVE] NEW Message received from Web:', data);
  };

  const registerTokenToServer = async (token) => {
    const cookies =
        Platform.OS === 'ios'
          ? await CookieManager.getAll(true)
          : await CookieManager.get('https://central.peacenik.app');
      console.log('CookieManager.get =>', cookies);
      const cookie = Object.values(cookies)
        .map((c) => `${c.name}=${c.value};`)
        .join(' ');
      console.log(cookie);
      try {
        const data = {
          token,
          device_id: DeviceInfo.getDeviceId(),
          os: Platform.OS,
        };
        const res = await axios.request({
          url: 'https://central.peacenik.app/rpc.UserService/RegisterFCMToken',
          method: 'post',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          data,
          withCredentials: false,
        });
        console.log(res);
      } catch (e) {
        console.log("onNavigationStateChange", e);
      }
  }

  const onNavigationStateChange = async (navState) => {
    console.log('******************', navState.url)
    if (navState.url.includes('messages')) {
      registerTokenToServer(token)
    }
  };

  const urlIsInApp = (str) => {
    for (const item of inAppUrls) {
      if (str.startsWith(item)) {
        return true;
      }
    }
    return false;
  }

  const onShouldLoad = (event, t) => {
  console.log(event,t);
    if (!urlIsInApp(event.url)) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webview}
        source={{uri: url}}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldLoad}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#599c0b',
  },
});

export default App;
