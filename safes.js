import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
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

const fetchFirebaseData = async (dataType, setData) => {
  try {
    const response = await firebase.database().ref(`/Al-Falaah Farms/${dataType}`);
    response.on('value', (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });
  } catch (error) {
    console.error(`Error fetching Firebase ${dataType} data:`, error);
  }
};

const App = () => {
  const [showGraphs, setShowGraphs] = useState(false);

  const [currentHum, setcurrentHum] = useState(null);
  const [currentTemp, setcurrentTemp] = useState(null);
  const [currentWeterLevel, setcurrentWeterLevel] = useState(null);
  
  const [humidityData, setHumidityData] = useState(null);
  const [temperatureData, setTemperatureData] = useState(null);
  const [waterLevelData, setWaterLevelData] = useState(null);
  const [ultrasonicDistance, setUltrasonicDistance] = useState(null);
  const [fireThreat, setFireThreat] = useState(false);

  useEffect(() => {

    fetchFirebaseData('currentTemp', setcurrentTemp);
    fetchFirebaseData('currentHum', setcurrentHum);
    fetchFirebaseData('currentWeterLevel', setcurrentWeterLevel);
    fetchFirebaseData('ultrasonicDistance', setUltrasonicDistance);
    fetchFirebaseData('fireThreat', setFireThreat);

    if (showGraphs) {
      // Fetch data when showing graphs

      fetchFirebaseData('Humidity', setHumidityData);
      fetchFirebaseData('Temperature', setTemperatureData);
      fetchFirebaseData('waterLevel', setWaterLevelData);
    }
  }, [showGraphs]);

  const renderChart = (data, title, yAxisLabel) => {
    const chartData = data
      ? Object.entries(data)
          .slice(-10)
          .map(([timestamp, reading]) => ({ label: timestamp, value: reading }))
      : [];

    return (
      <View style={styles.chartContainer}>
      
        <Text style={styles.header}>{title}</Text>
        {data ? (
          <View style={styles.chartWithLabel}>
            <LineChart
              data={{
                labels: chartData.map(() => ''),
                datasets: [
                  {
                    data: chartData.map((dataPoint) => dataPoint.value),
                  },
                ],
              }}
              width={350}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(50, 132, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              withDots={false}
              withShadow={false}
            />
            <Text style={styles.labelXAxis}>Time</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        <Text style={styles.labelYAxis}>{yAxisLabel}</Text>
      </View>
    );
  };

  const renderDataBox = (title, value, iconName) => (
    <View style={styles.dataBox}>
      <FontAwesome5 name={iconName} size={24} color="#333" />
      <Text style={styles.dataBoxTitle}>{title}</Text>
      <Text style={styles.dataBoxValue}>{typeof value === 'object' ? JSON.stringify(value) : value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AL-FALAAH FARMS DASHBOARD</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>



<             View style={styles.dataRow}>
                {renderDataBox('Temperature', currentTemp, 'temperature-high')}
                {renderDataBox(' Humidity', currentHum, 'cloud-rain')}
              </View>

              <View style={styles.dataRow}>
                {renderDataBox('Predator Threat', ultrasonicDistance, 'arrows-alt')}
                {renderDataBox('Fire Threat', fireThreat ? 'Yes' : 'No', 'gripfire')}
              </View>

              <View style={styles.dataRow}>
                {renderDataBox('Water Level', currentWeterLevel, 'water')}
              </View>


              {showGraphs ? (
            <TouchableOpacity onPress={() => setShowGraphs(false)}>
              <FontAwesome5 name="times" size={30} color="#007BFF" style={styles.closeGraphButton} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowGraphs(true)}>
              <FontAwesome5 name="chart-line" size={30} color="#007BFF" style={styles.openGraphButton} />
            </TouchableOpacity>
          )}

          {showGraphs && (
            <>



              {renderChart(humidityData, 'Humidity Data', 'Humidity')}
              {renderChart(temperatureData, 'Temperature Data', 'Temperature')}
              {renderChart(waterLevelData, 'Water Level Data', 'Water Level')}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  labelYAxis: {
    position: 'absolute',
    left: -30,
    top: 110,
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  labelXAxis: {
    marginTop: 8,
    fontSize: 16,
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
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
  },
  dataBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dataBoxValue: {
    fontSize: 16,
    color: '#555',
  },
  openGraphButton: {
    marginTop: 16,
  },
  closeGraphButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
});

export default App;
