import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const MainScreen = ({ navigation }) => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const swipeableRefs = useRef([]); // Guardamos las referencias de los Swipeables

  useEffect(() => {
    const loadCities = async () => {
      const storedCities = await AsyncStorage.getItem('cities');
      if (storedCities) {
        const citiesArray = JSON.parse(storedCities);
        setCities(citiesArray);
        fetchWeatherData(citiesArray);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    fetchWeatherData(cities);
  }, [cities]);

  const fetchWeatherData = (citiesArray) => {
    if (citiesArray.length > 0) {
      const simulatedWeatherData = citiesArray.map((city) => ({
        name: city,
        sys: { country: 'US' },
        weather: [{ description: 'Few clouds', icon: '02d' }],
        main: { temp: Math.floor(Math.random() * (35 - 10 + 1)) + 10 },
        dt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }));
      setWeatherData(simulatedWeatherData);
    } else {
      setWeatherData([]);
    }
  };

  const deleteCity = async (index) => {
    if (swipeableRefs.current[index]) {
      swipeableRefs.current[index].close(); // Cerrar el Swipeable antes de eliminar
    }

    const newCities = [...cities];
    newCities.splice(index, 1);
    setCities(newCities);
    await AsyncStorage.setItem('cities', JSON.stringify(newCities));
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Weather Time',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={{ marginLeft: 15 }}>
          <Icon name="settings" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddCityScreen')} style={{ marginRight: 15 }}>
          <Icon name="add" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderRightActions = (progress, dragX, index) => {
    return (
      <TouchableOpacity onPress={() => deleteCity(index)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {weatherData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Welcome to Weather Time!</Text>
          <Text style={styles.emptyMessage}>Press <Icon name="add" size={24} color="black" /> to add cities from around the world to view their date, time and weather.</Text>
          <Text style={styles.emptyMessage}>Press <Icon name="settings" size={24} color="black" /> for settings.{"\n"}Settings enables the user to select unit of temperature, text size, sound effects and brightness.</Text>
        </View>
      ) : (
        <FlatList
          data={weatherData}
          renderItem={({ item, index }) => (
            <Swipeable
              ref={(ref) => (swipeableRefs.current[index] = ref)} // Guardamos la referencia
              renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, index)}
            >
              <View style={styles.cityCard}>
                <View style={styles.cityHeader}>
                  <Text style={styles.cityName}>{item.name}, {item.sys.country}</Text>
                  <Text style={styles.cityTime}>{moment(item.dt).format('dddd, MMMM Do YYYY, h:mm A')}</Text>
                </View>

                <View style={styles.weatherInfo}>
                  <Image source={{ uri: getWeatherIcon(item.weather[0].icon) }} style={styles.weatherIcon} />
                  <Text style={styles.temperature}>{item.main.temp} °C</Text>
                  <Text style={styles.weatherDescription}>{item.weather[0].description}</Text>
                </View>

                <Text style={styles.cityDate}>{moment(item.dt).format('MMMM Do, YYYY')}</Text>
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
    justifyContent: 'center',
    padding: 10,
  },
  cityCard: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cityHeader: {
    marginBottom: 10,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cityTime: {
    fontSize: 14,
    color: '#555',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  cityDate: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '92%',
    borderRadius: 10,
    padding: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 25,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
});

export default MainScreen;
