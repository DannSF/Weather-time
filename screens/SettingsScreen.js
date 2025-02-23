import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Brightness from "expo-brightness";

const SettingsScreen = ({ navigation }) => {
  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [textSize, setTextSize] = useState("Normal");
  const [soundEffects, setSoundEffects] = useState(true);
  const [brightness, setBrightness] = useState(0.5);
  const [originalBrightness, setOriginalBrightness] = useState(0.5);

  useEffect(() => {
    const loadSettings = async () => {
      const savedTemperatureUnit = await AsyncStorage.getItem(
        "temperatureUnit"
      );
      const savedTextSize = await AsyncStorage.getItem("textSize");
      const savedSoundEffects = await AsyncStorage.getItem("soundEffects");
      const savedBrightness = await AsyncStorage.getItem("brightness");

      if (savedTemperatureUnit) setTemperatureUnit(savedTemperatureUnit);
      if (savedTextSize) setTextSize(savedTextSize);
      if (savedSoundEffects !== null)
        setSoundEffects(JSON.parse(savedSoundEffects));
      if (savedBrightness) setBrightness(parseFloat(savedBrightness));

      const systemBrightness = await Brightness.getBrightnessAsync();
      setOriginalBrightness(systemBrightness);
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    await AsyncStorage.setItem("temperatureUnit", temperatureUnit);
    await AsyncStorage.setItem("textSize", textSize);
    await AsyncStorage.setItem("soundEffects", JSON.stringify(soundEffects));
    await AsyncStorage.setItem("brightness", brightness.toString());
  };

  useEffect(() => {
    saveSettings();
  }, [temperatureUnit, textSize, soundEffects, brightness]);

  useEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
          style={{ marginLeft: 15 }}
        >
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
    await AsyncStorage.removeItem("temperatureUnit");
    await AsyncStorage.removeItem("textSize");
    await AsyncStorage.removeItem("soundEffects");
    await AsyncStorage.removeItem("brightness");

    setTemperatureUnit("Celsius");
    setTextSize("Normal");
    setSoundEffects(true);
    setBrightness(0.5);

    setBrightness(originalBrightness);
    await Brightness.setBrightnessAsync(originalBrightness);
  };

  const textSizeStyle = {
    fontSize: textSize === "Normal" ? 16 : textSize === "Large" ? 18 : 20,
  };

  const handleBrightnessChange = async (value) => {
    setBrightness(value);
    await Brightness.setBrightnessAsync(value);
  };

  const saveTextSize = async (size) => {
    await AsyncStorage.setItem("textSize", size);
  };

  useEffect(() => {
    const loadTextSize = async () => {
      const savedTextSize = await AsyncStorage.getItem("textSize");
      if (savedTextSize) {
        setTextSize(savedTextSize);
      }
    };
    loadTextSize();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingTitle, textSizeStyle]}>
          Temperature Unit
        </Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              temperatureUnit === "Celsius" && styles.selectedOption,
            ]}
            onPress={() => setTemperatureUnit("Celsius")}
          >
            <Text style={[styles.optionText, textSizeStyle]}>Celsius</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              temperatureUnit === "Fahrenheit" && styles.selectedOption,
            ]}
            onPress={() => setTemperatureUnit("Fahrenheit")}
          >
            <Text style={[styles.optionText, textSizeStyle]}>Fahrenheit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingTitle, textSizeStyle]}>Text Size</Text>
        <View style={styles.optionContainer}>
          {["Normal", "Large", "Extra Large"].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                textSize === size && styles.selectedOption,
              ]}
              onPress={() => setTextSize(size)}
            >
              <Text style={[styles.optionText, textSizeStyle]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.separator} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingTitle, textSizeStyle]}>Sound Effects</Text>
        <Switch value={soundEffects} onValueChange={setSoundEffects} />
        <View style={styles.separator} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingTitle, textSizeStyle]}>Brightness</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={brightness}
          onValueChange={handleBrightnessChange}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="gray"
          thumbTintColor="black"
        />
        <View style={styles.separator} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingTitle, textSizeStyle]}>Weather Time</Text>
        <Text style={[styles.aboutText, textSizeStyle]}>
          (c) 2025 ABC Solutions Pty Ltd
        </Text>
        <Text style={[styles.aboutText, textSizeStyle]}>Version 1.0</Text>
        <Text style={[styles.aboutText, textSizeStyle]}>
          Last update: 17 February 2025
        </Text>
        <Text style={[styles.aboutText, textSizeStyle]}>
          Build date: 17 February 2025
        </Text>
        <Text style={[styles.aboutText, textSizeStyle]}>Developer: </Text>
        <Text style={[styles.aboutText, textSizeStyle]}>Student Number:</Text>
      </View>
    </View>
  );
};

const getFontSize = (size) => {
  switch (size) {
    case "small":
      return 14;
    case "large":
      return 22;
    default:
      return 18;
  }
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: "lightblue",
  },
  optionText: {
    fontSize: 16,
  },
  aboutText: {
    color: "gray",
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginTop: 20,
  },
});

export default SettingsScreen;
