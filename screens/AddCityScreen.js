import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

import { CITY_LIST } from "../constants/Cities";
import { fetchWeather } from "../services/weatherAPI";

const AddCityScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState(CITY_LIST);
  const [showSearchButton, setShowSearchButton] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Choose a City",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = CITY_LIST.filter((city) =>
      city.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowSearchButton(filtered.length === 0);
  };

  const searchCity = async () => {
    if (search.trim() === "") {
      Alert.alert("Error", "Please enter a city name.");
      return;
    }

    const filtered = CITY_LIST.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
      const cityExistsInApi = await fetchWeatherData(search);
      if (!cityExistsInApi) {
        Alert.alert(
          "City not found",
          "This city is not available in the list or API."
        );
      } else {
        await AsyncStorage.setItem("searchedCity", JSON.stringify(search));
        navigation.navigate("MainScreen");
      }
    } else {
      setFilteredCities(filtered);
    }
  };

  const fetchWeatherData = async (cityName) => {
    try {
      const weather = await fetchWeather(cityName);
      if (weather && weather.cod === 200) {
        addCity(cityName);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      return false;
    }
  };

  const addCity = async (cityName) => {
    const existingCities = await AsyncStorage.getItem("cities");
    const citiesArray = existingCities ? JSON.parse(existingCities) : [];

    if (!citiesArray.includes(cityName)) {
      citiesArray.push(cityName);
      await AsyncStorage.setItem("cities", JSON.stringify(citiesArray));
      navigation.navigate("MainScreen");
    } else {
      Alert.alert("Error", "City already added");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a city..."
        value={search}
        onChangeText={handleSearch}
      />

      {showSearchButton && (
        <TouchableOpacity style={styles.searchButton} onPress={searchCity}>
          <Text style={styles.searchButtonText}>Search City</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityItem}
            onPress={() => addCity(item.name)}
          >
            <Text style={styles.cityName}>{item.name}</Text>
            <Text style={styles.countryName}>{item.country}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cityName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countryName: {
    fontSize: 14,
    color: "gray",
  },
});

export default AddCityScreen;
