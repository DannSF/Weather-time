import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import { fetchWeather } from "../services/weatherAPI";

const MainScreen = ({ navigation }) => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [textSize, setTextSize] = useState("Normal");
  const swipeableRefs = useRef([]);

  useEffect(() => {
    const loadData = async () => {
      const [storedCities, savedTemperatureUnit, savedTextSize] =
        await Promise.all([
          AsyncStorage.getItem("cities"),
          AsyncStorage.getItem("temperatureUnit"),
          AsyncStorage.getItem("textSize"),
        ]);

      if (storedCities) {
        const citiesArray = JSON.parse(storedCities);
        setCities(citiesArray);
        fetchWeatherData(citiesArray);
      }

      if (savedTemperatureUnit) {
        setTemperatureUnit(savedTemperatureUnit);
      }

      if (savedTextSize) {
        setTextSize(savedTextSize);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchWeatherData(cities);
  }, [cities, temperatureUnit]);

  const convertTemperature = (tempInCelsius) => {
    if (temperatureUnit === "Fahrenheit") {
      return Math.round((tempInCelsius * 9) / 5 + 32);
    }
    return Math.round(tempInCelsius);
  };

  const getLocalTime = (timestamp, timezoneOffset) => {
    const utcTime = moment.unix(timestamp).utc();
    const localTime = utcTime.clone().add(timezoneOffset, "seconds");
    return localTime.format("dddd, hh:mm A");
  };

  const fetchWeatherData = async (citiesArray) => {
    if (citiesArray.length > 0) {
      try {
        const weatherPromises = citiesArray.map((city) =>
          fetchWeather(
            city,
            temperatureUnit === "Celsius" ? "metric" : "imperial"
          )
        );
        const results = await Promise.all(weatherPromises);

        const validResults = results.filter(
          (data) => data !== null && data.cod === 200
        );
        if (validResults.length !== results.length) {
          alert("Some cities were not found.");
        }

        setWeatherData(validResults);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("There was an error loading the weather data. Please try again.");
      }
    } else {
      setWeatherData([]);
    }
  };

  const deleteCity = async (index) => {
    if (swipeableRefs.current[index]) {
      swipeableRefs.current[index].close();
    }

    const newCities = [...cities];
    newCities.splice(index, 1);
    setCities(newCities);
    await AsyncStorage.setItem("cities", JSON.stringify(newCities));
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Weather Time",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={{ marginLeft: 15 }}
        >
          <Icon name="settings" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCityScreen")}
          style={{ marginRight: 15 }}
        >
          <Icon name="add" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderRightActions = (progress, dragX, index) => {
    return (
      <TouchableOpacity
        onPress={() => deleteCity(index)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    );
  };

  const textSizeStyle = {
    fontSize: textSize === "Normal" ? 16 : textSize === "Large" ? 18 : 20,
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {weatherData.length === 0 && cities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, textSizeStyle]}>
            Welcome to Weather Time!
          </Text>
          <Text style={[styles.emptyMessage, textSizeStyle]}>
            Press <Icon name="add" size={24} color="black" /> to add cities from
            around the world to view their date, time and weather.
          </Text>
          <Text style={[styles.emptyMessage, textSizeStyle]}>
            Press <Icon name="settings" size={24} color="black" /> for settings.
            {"\n"}Settings enables the user to select unit of temperature, text
            size, sound effects and brightness.
          </Text>
        </View>
      ) : (
        <FlatList
          data={weatherData}
          renderItem={({ item, index }) => (
            <Swipeable
              ref={(ref) => (swipeableRefs.current[index] = ref)}
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, index)
              }
            >
              <View style={styles.cityCard}>
                <View style={styles.cityHeader}>
                  <Text style={[styles.cityName, textSizeStyle]}>
                    {item.name}, {item.sys.country}
                  </Text>
                  <Text style={[styles.cityTime, textSizeStyle]}>
                    {getLocalTime(item.dt, item.timezone)}
                  </Text>
                </View>

                <View style={styles.weatherInfo}>
                  <Image
                    source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                    style={styles.weatherIcon}
                  />
                  <View style={styles.weatherDetails}>
                    <Text style={[styles.temperature, textSizeStyle]}>
                      {temperatureUnit === "Celsius"
                        ? `${Math.round(item.main.temp)} °C`
                        : `${Math.round(item.main.temp)} °F`}
                    </Text>
                    <Text style={[styles.weatherDescription, textSizeStyle]}>
                      {item.weather[0].description}
                    </Text>
                    <Text style={[styles.weatherDetail, textSizeStyle]}>
                      Feels Like:
                      {temperatureUnit === "Celsius"
                        ? ` ${Math.round(item.main.feels_like)} °C`
                        : ` ${Math.round(item.main.feels_like)} °F`}
                    </Text>
                    <Text style={[styles.weatherDetail, textSizeStyle]}>
                      Humidity: {Math.round(item.main.humidity)} %
                    </Text>
                    <Text style={[styles.weatherDetail, textSizeStyle]}>
                      Wind Speed: {Math.round(item.wind.speed)} MPH
                    </Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  cityCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "94%",
    borderRadius: 10,
    padding: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cityHeader: {
    marginBottom: 10,
  },
  cityName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cityTime: {
    fontSize: 14,
    color: "#666",
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: 90,
    height: 90,
    marginRight: 15,
  },
  weatherDetails: {
    flex: 1,
    alignItems: "flex-end",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  weatherDescription: {
    fontSize: 18,
    color: "#444",
    textTransform: "capitalize",
  },
  weatherDetail: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default MainScreen;
