import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import WiFiManager from 'react-native-wifi-reborn';
import {Dropdown} from 'react-native-element-dropdown';

const WiFiDistanceCalculator = () => {
  const [device1SignalStrength, setDevice1SignalStrength] = useState(null);
  const [device2SignalStrength, setDevice2SignalStrength] = useState(null);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [data, setData] = useState([]);

  const [firstDev, setFirstDev] = useState(null);
  const [secondDev, setSecondDev] = useState(null);

  console.log(firstDev);
  console.log(secondDev);
  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Location permissions granted');

        // Now you can load WiFi list or perform other location-based tasks.
      } else {
        Alert.alert('Location permissions denied', 'Please Turn on Location');
        console.log('Location permissions denied');
        // Handle the case where the user denied permission.
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const fetchData = async () => {
    try {
      const wifiList = await WiFiManager.loadWifiList();
      const temp = wifiList.map((item, index) => {
        return {
          value: item.SSID,
          label: item.SSID,
          BSSID: item.BSSID,
          capabilities: item.capabilities,
          frequency: item.frequency,
          level: item.level,
          timestamp: item.timestamp,
        };
      });
      setData(temp);
      console.log('wifiList', temp);
    } catch (error) {
      Alert.alert('Alert', 'Please Turn on Location');
      console.error('Error loading WiFi list:', error);
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const onSubmit = async () => {
    const wifiList = data;
    const device1Network = wifiList.find(network => network.value === firstDev);
    const device2Network = wifiList.find(
      network => network.value === secondDev,
    );

    console.log('device1Network', wifiList);
    console.log('device2Network', device2Network);

    if (device1Network && device2Network) {
      const device1SignalStrength = device1Network.level;
      const device2SignalStrength = device2Network.level;
      const estimatedDistance = calculateDistance(
        device1SignalStrength,
        device2SignalStrength,
      );

      console.log(device1SignalStrength);
      setDevice1SignalStrength(device1SignalStrength);
      setDevice2SignalStrength(device2SignalStrength);
      setEstimatedDistance(estimatedDistance);
    }
  };
  const calculateDistance = (device1SignalStrength, device2SignalStrength) => {
    // Your calculateDistance function remains the same
    const signalStrengthDifference =
      device1SignalStrength - device2SignalStrength;
    const estimatedDistance = Math.abs(signalStrengthDifference) * 0.1; // Adjust this factor as needed

    return estimatedDistance.toFixed(2);
  };

  return (
    <View>

      <View style={{marginTop: 20}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <TouchableOpacity style={styles.updateButton} onPress={fetchData}>
            <Text style={styles.updateButtonText}>Get Devices</Text>
          </TouchableOpacity>
        </View>
        {data.length !== 0 && (
          <View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Dropdown
              data={data}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 5,
                width: '45%',
              }}
              placeholder={'Select First Device'}
              maxHeight={300}
              labelField="value"
              valueField="value"
              value={firstDev}
              onChange={item => {
                setFirstDev(item.value);
              }}
            />
            <Dropdown
              data={data}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 5,
                width: '45%',
              }}
              maxHeight={300}
              placeholder={'Select Second Device'}
              labelField="value"
              valueField="value"
              value={secondDev}
              onChange={item => {
                setSecondDev(item.value);
              }}
            />
          </View>
        )}
        {firstDev && secondDev ? (
          <View style={{alignItems: 'center', marginVertical: 30}}>
            <Text style={{color: 'black', marginVertical: 10}}>
              {firstDev} Signal Strength:
              <Text style={{color: 'red'}}> {device1SignalStrength} dBm</Text>
            </Text>
            <Text style={{color: 'black', marginVertical: 10}}>
              {secondDev} Signal Strength:
              <Text style={{color: 'red'}}> {device2SignalStrength} dBm</Text>
            </Text>
            <Text style={{color: 'black', marginVertical: 10}}>
              Estimated Distance:
              <Text style={{color: 'red'}}> {estimatedDistance} meters</Text>
            </Text>
          </View>
        ) : null}
        {data.length !== 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={[
                styles.updateButton,
                {backgroundColor: firstDev && secondDev ? 'blue' : 'gray'},
              ]}
              disabled={firstDev && secondDev ? false : true}
              onPress={onSubmit}>
              <Text style={styles.updateButtonText}>Calculate Distance</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default WiFiDistanceCalculator;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
  },

  input: {
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  updateButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
});
