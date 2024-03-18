import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text,TextInput, Image, ActivityIndicator, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome5 } from '@expo/vector-icons';

const firebaseConfig = {
  apiKey: "AIzaSyBxzbT3qgErbpPJoWC3_XRQTZUGImxiTOk",
  authDomain: "shelmet-rice360.firebaseapp.com",
  databaseURL: "https://shelmet-rice360-default-rtdb.firebaseio.com",
  projectId: "shelmet-rice360",
  storageBucket: "shelmet-rice360.appspot.com",
  messagingSenderId: "335695495752",
  appId: "1:335695495752:web:e88428bf4f0e204d8ace7d",
  measurementId: "G-32BYR7J7QM"
};

firebase.initializeApp(firebaseConfig);

const fetchFirebaseData = (dataType, setData) => {
  try {
    const reference = firebase.database().ref(`/Al-Falaah Farms/${dataType}`);

    reference.on('value', (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });

    return () => reference.off('value');
  } catch (error) {
    console.error(`Error fetching Firebase ${dataType} data:`, error);
  }
};


const App = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
   
    if (username === 'Manager' && password === '1234') {
      setLoggedIn(true); 
    } else if (username === 'CEO' && password === 'c234') {
      setLoggedIn(true); 
    } else {
      alert('Invalid username or password');
    }
  };

  const [showGraphs, setShowGraphs] = useState(false);

  const [currentHum, setcurrentHum] = useState(null);
  const [currentTemp, setcurrentTemp] = useState(null);
  const [currentWeterLevel, setcurrentWeterLevel] = useState(null);

  const [humidityData, setHumidityData] = useState(null);
  const [temperatureData, setTemperatureData] = useState(null);
  const [waterLevelData, setWaterLevelData] = useState(null);
  const [ultrasonicDistance, setUltrasonicDistance] = useState(null);
  const [fireThreat, setFireThreat] = useState(false);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState(false);

  const [pumpStatus, setPumpStatus] = useState(0);
  const [ultrasonicStatus, setUltrasonicStatus] = useState(0); 


  useEffect(() => {
    fetchFirebaseData('currentTemp', setcurrentTemp);
    fetchFirebaseData('currentHum', setcurrentHum);
    fetchFirebaseData('currentWeterLevel', setcurrentWeterLevel);
    fetchFirebaseData('ultrasonicDistance', setUltrasonicDistance);
    fetchFirebaseData('fireThreat', setFireThreat);
    fetchFirebaseData('currentSoilMoisture', setCurrentSoilMoisture);
    fetchFirebaseData('pumpStatus', setPumpStatus); 
    fetchFirebaseData('ultrasonicStatus', setUltrasonicStatus); 



    if (showGraphs) {
      fetchFirebaseData('Humidity', setHumidityData);
      fetchFirebaseData('Temperature', setTemperatureData);
      fetchFirebaseData('waterLevel', setWaterLevelData);
    }
    


  }, [showGraphs]);


  const toggleUltrasonic = () => {
    const newUltrasonicStatus = ultrasonicStatus ? 0 : 1; 
    setUltrasonicStatus(newUltrasonicStatus);
  
    try {
      firebase.database().ref('/Al-Falaah Farms/ultrasonicStatus').set(newUltrasonicStatus);
    } catch (error) {
      console.error('Error updating ultrasonic status:', error);
    }
  };

  const renderLoginForm = () => {
    return (
      <View style={styles.containerCover}>
      <View style={styles.loginContainer}>
        <Image source={require("./logo/traced-2.jpg")} style={styles.logo} />
        <Text style={styles.title}>AL-FALAAH FARMS</Text>
        {loggedIn ? (
          <Text>Welcome, {username}!</Text>
        ) : (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
    );
  };


  const renderChart = (data, title, yAxisLabel) => {
    const chartData = data
    ? Object.values(data)
        .slice(-72)  
        .map((entry) => ({ reading: entry }))
    : [];

  const xLabels = Array.from({ length: 24 }, (_, index) => (72 - index * 3).toString());

  const currentTimeIndex = Math.min(chartData.length - 1, 24);
  xLabels[currentTimeIndex] = 'now';


    return (
      <View style={styles.chartContainer}>
        <Text style={styles.header}>{title}</Text>
        {data ? (
          <View style={styles.chartWithLabel}>
            <View style={styles.chartBorder}>
              <LineChart
                data={{
                  labels: xLabels,
                  datasets: [
                    {
                      data: chartData.map((dataPoint) => dataPoint.reading),
                    },
                  ],
                }}
                width={800}
                height={250}
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 3,
                  },
                  propsForBackgroundLines: {
                    display: 'none',
                  },
                  fromZero: true,
                  gridMin: 0,
                  gridMax: Math.max(...chartData.map((dataPoint) => dataPoint.reading)) + 10,
                  yAxisLabel,
                  yAxisSuffix: '',
                }}
                bezier
                withDots={false}
                withShadow={false}
              />
              <View style={styles.yAxisBorder} />
              <View style={styles.xAxisBorder} />
            </View>
            <Text style={styles.labelXAxis}>Last 72 Hours (3 Days)</Text>
            <Text style={styles.labelYAxis}>{yAxisLabel}</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  };
  

  const renderDataBox = (title, value, iconName) => {
  
    const backgroundColor =
    (title === 'Predator Threat' && ultrasonicDistance !== null && ultrasonicDistance < 10) ||
    (title === 'Fire Threat' && fireThreat) ||
    (title === 'Soil Moisturised' && currentSoilMoisture) ||
    (title === 'Water Level' && currentWeterLevel !== null && currentWeterLevel < 10)
      ? 'rgba(255, 0, 0, 0.25)' 
      : 'white';
  
    return (
      <View style={[styles.dataBox, { backgroundColor }]}>
        <FontAwesome5 name={iconName} size={35} color="#333" />
        <Text style={styles.dataBoxTitle}>{title}</Text>
        <Text style={styles.dataBoxValue}>{typeof value === 'object' ? JSON.stringify(value) : value}</Text>
      </View>
    );
  };
  

  const renderDashboard = () => {
    return (
      <View style={styles.container}>
         
    <SafeAreaView style={styles.container}>

      <Image source={require("./logo/traced-2.jpg")} style={styles.logo} />
      <Text style={styles.title}>AL-FALAAH FARMS DASHBOARD</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>

          <View style={styles.dataRow}>
            {renderDataBox('Temperature', currentTemp, 'temperature-high')}
            {renderDataBox(' Humidity', currentHum, 'cloud-rain')}
            {renderDataBox('Predator Threat', ultrasonicDistance, 'arrows-alt')}
          </View>
          <View style={styles.dataRow}>
          {renderDataBox('Fire Threat', fireThreat ? 'Yes' : 'No', 'gripfire')}
            {renderDataBox('Water Level', currentWeterLevel, 'water')}
            {renderDataBox('Soil Moisturised', currentSoilMoisture ? 'No' : 'Yes', 'seedling')}
          </View>
          <View style={styles.buttonsContainer}>

            <TouchableOpacity onPress={() => setShowGraphs(!showGraphs)} style={styles.buttonBox}>
              <View style={styles.button}>
                <FontAwesome5 name="chart-line" size={30} color={showGraphs ? 'green' : 'red'} style={styles.buttonIcon} />
                <Text style={styles.buttonTitle}>{showGraphs ? 'Graphs On' : 'Graphs Off'}</Text>
              </View>
            </TouchableOpacity>
            

            {loggedIn && ( 
    <>
      {username === 'Manager' && ( 
        <>
          <TouchableOpacity onPress={togglePump} style={styles.buttonBox}>
            <View style={styles.button}>
              <FontAwesome5
                name={pumpStatus ? 'toggle-on' : 'toggle-off'}
                size={30}
                color={pumpStatus ? 'green' : 'red'}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonTitle}>{pumpStatus ? 'Pump On' : 'Pump Off'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleUltrasonic} style={styles.buttonBox}>
            <View style={styles.button}>
              <FontAwesome5
                name={ultrasonicStatus ? 'toggle-on' : 'toggle-off'}
                size={30}
                color={ultrasonicStatus ? 'green' : 'red'}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonTitle}>{ultrasonicStatus ? 'Ultrasonic On' : 'Ultrasonic Off'}</Text>
            </View>
          </TouchableOpacity>
        </>
      )}


    </>
  )}






            <TouchableOpacity onPress={() => setLoggedIn(false)} style={styles.buttonBox}>
              <View style={styles.button}>
               <FontAwesome5 name="sign-out-alt" size={30} color="red" style={styles.buttonIcon} />
               <Text style={styles.buttonTitle}>Logout</Text>
             </View>
           </TouchableOpacity>

          </View>

          {showGraphs && (
            <>
           
              {renderChart(humidityData, 'Average Humidity Data', 'Humidity (%)')}
              {renderChart(temperatureData, 'Average Temperature Data', 'Temperature (*C)')}
          
            </>
          )}
        </View>
      </ScrollView>

   

    
    
    </SafeAreaView>
  
      </View>
    );
  };
  

  const togglePump = () => {
    const newPumpStatus = pumpStatus ? 0 : 1; 
    setPumpStatus(newPumpStatus);
  
    try {
      firebase.database().ref('/Al-Falaah Farms/pumpStatus').set(newPumpStatus);
    } catch (error) {
      console.error('Error updating pump status:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      {loggedIn ? renderDashboard() : renderLoginForm()}
    </View>
  );



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 30,
  },


  
  xAxisBorder: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    marginTop: -40, 
  },
  yAxisBorder: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    marginRight: -1, 
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  
  labelYAxis: {
    position: 'absolute',
    left: -25,
    top: 85,
    transform: [{ rotate: '-90deg' }],
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  labelXAxis: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  chartWithLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 50,
    borderRadius: 5,
    marginHorizontal: 8,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  dataBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  
  dataBoxValue: {
    fontSize: 30,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  buttonBox: {
    flex: 1,
    marginRight: 1,
    flexDirection: 'row',
  },
button: {
  backgroundColor: 'white',
  padding: 25,
  borderRadius: 2,
  alignItems: 'center',
  justifyContent: 'center',
},
buttonTitle: {
  color: 'white',
  fontSize: 16,
},

  buttonIcon: {
    marginBottom: 8,
  },
  buttonTitle: {
    color: 'black',
  },
  togglePumpButton: {
    marginTop: 16,
  },
  openGraphButton: {
    marginTop: 16,
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeGraphButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },




  containerCover: {
    flex: 1,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    backgroundColor: '#f0f0f0', 
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },


});

export default App;
