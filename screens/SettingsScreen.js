import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [textSize, setTextSize] = useState('Normal');
  const [soundEffects, setSoundEffects] = useState(true);
  const [brightness, setBrightness] = useState(0.5);

  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={resetSettings} style={{ marginRight: 15 }}>
          <Icon name="restore" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const resetSettings = async () => {
    await AsyncStorage.removeItem('temperatureUnit');
    setTemperatureUnit('Celsius');
    setTextSize('Normal');
    setSoundEffects(true);
    setBrightness(0.5);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Temperature Unit</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, temperatureUnit === 'Celsius' && styles.selectedOption]}
            onPress={() => setTemperatureUnit('Celsius')}
          >
            <Text style={styles.optionText}>Celsius</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, temperatureUnit === 'Fahrenheit' && styles.selectedOption]}
            onPress={() => setTemperatureUnit('Fahrenheit')}
          >
            <Text style={styles.optionText}>Fahrenheit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />  
      </View>

      {/* Text Size */}
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Text Size</Text>
        <View style={styles.optionContainer}>
          {['Normal', 'Large', 'Extra Large'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.optionButton, textSize === size && styles.selectedOption]}
              onPress={() => setTextSize(size)}
            >
              <Text style={styles.optionText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.separator} />  
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Sound Effects</Text>
        <Switch value={soundEffects} onValueChange={setSoundEffects} />
        <View style={styles.separator} />  
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Brightness</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={brightness}
          onValueChange={setBrightness}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="gray"
          thumbTintColor="black"
        />
        <View style={styles.separator} />  
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Weather Time</Text>
        <Text style={styles.aboutText}>(c) 2025 ABC Solutions Pty Ltd</Text>
        <Text style={styles.aboutText}>Version 1.0</Text>
        <Text style={styles.aboutText}>Last update: 17 February 2025</Text>
        <Text style={styles.aboutText}>Build date: 17 February 2025</Text>
        <Text style={styles.aboutText}>Developer: </Text>
        <Text style={styles.aboutText}>Student Number:</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  optionText: {
    fontSize: 16,
  },
  aboutText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginTop: 20,
  },
});

export default SettingsScreen;
