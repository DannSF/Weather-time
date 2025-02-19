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

// Lista de ciudades disponibles

const CITY_LIST = [
  { name: "Kabul", country: "Afghanistan" },
  { name: "Herat", country: "Afghanistan" },
  { name: "Tirana", country: "Albania" },
  { name: "Durrës", country: "Albania" },
  { name: "Algiers", country: "Algeria" },
  { name: "Oran", country: "Algeria" },
  { name: "Andorra la Vella", country: "Andorra" },
  { name: "Escaldes-Engordany", country: "Andorra" },
  { name: "Luanda", country: "Angola" },
  { name: "Lobito", country: "Angola" },
  { name: "Buenos Aires", country: "Argentina" },
  { name: "Córdoba", country: "Argentina" },
  { name: "Yerevan", country: "Armenia" },
  { name: "Gyumri", country: "Armenia" },
  { name: "Sydney", country: "Australia" },
  { name: "Melbourne", country: "Australia" },
  { name: "Vienna", country: "Austria" },
  { name: "Graz", country: "Austria" },
  { name: "Baku", country: "Azerbaijan" },
  { name: "Ganja", country: "Azerbaijan" },
  { name: "Nassau", country: "Bahamas" },
  { name: "Freeport", country: "Bahamas" },
  { name: "Manama", country: "Bahrain" },
  { name: "Riffa", country: "Bahrain" },
  { name: "Dhaka", country: "Bangladesh" },
  { name: "Chittagong", country: "Bangladesh" },
  { name: "Minsk", country: "Belarus" },
  { name: "Gomel", country: "Belarus" },
  { name: "Brussels", country: "Belgium" },
  { name: "Antwerp", country: "Belgium" },
  { name: "Belize City", country: "Belize" },
  { name: "San Ignacio", country: "Belize" },
  { name: "Porto-Novo", country: "Benin" },
  { name: "Cotonou", country: "Benin" },
  { name: "Thimphu", country: "Bhutan" },
  { name: "Phuntsholing", country: "Bhutan" },
  { name: "La Paz", country: "Bolivia" },
  { name: "Santa Cruz", country: "Bolivia" },
  { name: "Sarajevo", country: "Bosnia and Herzegovina" },
  { name: "Banja Luka", country: "Bosnia and Herzegovina" },
  { name: "Gaborone", country: "Botswana" },
  { name: "Francistown", country: "Botswana" },
  { name: "São Paulo", country: "Brazil" },
  { name: "Rio de Janeiro", country: "Brazil" },
  { name: "Sofia", country: "Bulgaria" },
  { name: "Plovdiv", country: "Bulgaria" },
  { name: "Toronto", country: "Canada" },
  { name: "Vancouver", country: "Canada" },
  { name: "Santiago", country: "Chile" },
  { name: "Valparaíso", country: "Chile" },
  { name: "Beijing", country: "China" },
  { name: "Shanghai", country: "China" },
  { name: "Bogotá", country: "Colombia" },
  { name: "Medellín", country: "Colombia" },
  { name: "San José", country: "Costa Rica" },
  { name: "Alajuela", country: "Costa Rica" },
  { name: "Zagreb", country: "Croatia" },
  { name: "Split", country: "Croatia" },
  { name: "Havana", country: "Cuba" },
  { name: "Santiago de Cuba", country: "Cuba" },
  { name: "Nicosia", country: "Cyprus" },
  { name: "Limassol", country: "Cyprus" },
  { name: "Prague", country: "Czech Republic" },
  { name: "Brno", country: "Czech Republic" },
  { name: "Copenhagen", country: "Denmark" },
  { name: "Aarhus", country: "Denmark" },
  { name: "Quito", country: "Ecuador" },
  { name: "Guayaquil", country: "Ecuador" },
  { name: "Cairo", country: "Egypt" },
  { name: "Alexandria", country: "Egypt" },
  { name: "San Salvador", country: "El Salvador" },
  { name: "Santa Ana", country: "El Salvador" },
  { name: "Tallinn", country: "Estonia" },
  { name: "Tartu", country: "Estonia" },
  { name: "Addis Ababa", country: "Ethiopia" },
  { name: "Dire Dawa", country: "Ethiopia" },
  { name: "Helsinki", country: "Finland" },
  { name: "Espoo", country: "Finland" },
  { name: "Paris", country: "France" },
  { name: "Marseille", country: "France" },
  { name: "Berlin", country: "Germany" },
  { name: "Hamburg", country: "Germany" },
  { name: "Athens", country: "Greece" },
  { name: "Thessaloniki", country: "Greece" },
  { name: "Guatemala City", country: "Guatemala" },
  { name: "Quetzaltenango", country: "Guatemala" },
  { name: "Tegucigalpa", country: "Honduras" },
  { name: "San Pedro Sula", country: "Honduras" },
  { name: "Budapest", country: "Hungary" },
  { name: "Debrecen", country: "Hungary" },
  { name: "Reykjavik", country: "Iceland" },
  { name: "Kopavogur", country: "Iceland" },
  { name: "New Delhi", country: "India" },
  { name: "Mumbai", country: "India" },
  { name: "Jakarta", country: "Indonesia" },
  { name: "Surabaya", country: "Indonesia" },
  { name: "Tehran", country: "Iran" },
  { name: "Mashhad", country: "Iran" },
  { name: "Baghdad", country: "Iraq" },
  { name: "Basra", country: "Iraq" },
  { name: "Dublin", country: "Ireland" },
  { name: "Cork", country: "Ireland" },
  { name: "Jerusalem", country: "Israel" },
  { name: "Tel Aviv", country: "Israel" },
  { name: "Rome", country: "Italy" },
  { name: "Milan", country: "Italy" },
  { name: "Kingston", country: "Jamaica" },
  { name: "Montego Bay", country: "Jamaica" },
  { name: "Tokyo", country: "Japan" },
  { name: "Osaka", country: "Japan" },
  { name: "Amman", country: "Jordan" },
  { name: "Zarqa", country: "Jordan" },
  { name: "Nur-Sultan", country: "Kazakhstan" },
  { name: "Almaty", country: "Kazakhstan" },
  { name: "Nairobi", country: "Kenya" },
  { name: "Mombasa", country: "Kenya" },
  { name: "Riga", country: "Latvia" },
  { name: "Daugavpils", country: "Latvia" },
  { name: "Beirut", country: "Lebanon" },
  { name: "Tripoli", country: "Lebanon" },
  { name: "Mexico City", country: "Mexico" },
  { name: "Guadalajara", country: "Mexico" },
  { name: "Amsterdam", country: "Netherlands" },
  { name: "Rotterdam", country: "Netherlands" },
  { name: "Oslo", country: "Norway" },
  { name: "Bergen", country: "Norway" },
  { name: "Islamabad", country: "Pakistan" },
  { name: "Karachi", country: "Pakistan" },
  { name: "Lima", country: "Peru" },
  { name: "Arequipa", country: "Peru" },
  { name: "Manila", country: "Philippines" },
  { name: "Cebu", country: "Philippines" },
  { name: "Warsaw", country: "Poland" },
  { name: "Kraków", country: "Poland" },
  { name: "Lisbon", country: "Portugal" },
  { name: "Porto", country: "Portugal" },
  { name: "Bucharest", country: "Romania" },
  { name: "Cluj-Napoca", country: "Romania" },
  { name: "Moscow", country: "Russia" },
  { name: "Saint Petersburg", country: "Russia" },
  { name: "Belgrade", country: "Serbia" },
  { name: "Novi Sad", country: "Serbia" },
  { name: "Singapore", country: "Singapore" },
  { name: "Jurong East", country: "Singapore" },
  { name: "Bratislava", country: "Slovakia" },
  { name: "Košice", country: "Slovakia" },
  { name: "Ljubljana", country: "Slovenia" },
  { name: "Maribor", country: "Slovenia" },
  { name: "Cape Town", country: "South Africa" },
  { name: "Johannesburg", country: "South Africa" },
  { name: "Seoul", country: "South Korea" },
  { name: "Busan", country: "South Korea" },
  { name: "Madrid", country: "Spain" },
  { name: "Barcelona", country: "Spain" },
  { name: "Stockholm", country: "Sweden" },
  { name: "Gothenburg", country: "Sweden" },
  { name: "Bern", country: "Switzerland" },
  { name: "Zurich", country: "Switzerland" },
  { name: "Taipei", country: "Taiwan" },
  { name: "Kaohsiung", country: "Taiwan" },
  { name: "Dar es Salaam", country: "Tanzania" },
  { name: "Dodoma", country: "Tanzania" },
  { name: "Istanbul", country: "Turkey" },
  { name: "Ankara", country: "Turkey" },
  { name: "Kiev", country: "Ukraine" },
  { name: "Kharkiv", country: "Ukraine" },
  { name: "Abu Dhabi", country: "United Arab Emirates" },
  { name: "Dubai", country: "United Arab Emirates" },
  { name: "London", country: "United Kingdom" },
  { name: "Manchester", country: "United Kingdom" },
  { name: "New York", country: "USA" },
  { name: "Los Angeles", country: "USA" },
  { name: "Montevideo", country: "Uruguay" },
  { name: "Salto", country: "Uruguay" },
  { name: "Caracas", country: "Venezuela" },
  { name: "Maracaibo", country: "Venezuela" },
  { name: "Ho Chi Minh City", country: "Vietnam" },
  { name: "Hanoi", country: "Vietnam" },
  { name: "Harare", country: "Zimbabwe" },
  { name: "Bulawayo", country: "Zimbabwe" },
];

const AddCityScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState(CITY_LIST);

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

  // Filtrar ciudades según la búsqueda
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = CITY_LIST.filter((city) =>
      city.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  // Guardar ciudad seleccionada en AsyncStorage
  const addCity = async (cityName) => {
    const existingCities = await AsyncStorage.getItem("cities");
    const citiesArray = existingCities ? JSON.parse(existingCities) : [];

    if (!citiesArray.includes(cityName)) {
      citiesArray.push(cityName);
      await AsyncStorage.setItem("cities", JSON.stringify(citiesArray));

      // Volver a `MainScreen` y actualizar lista
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

// Estilos
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

// const CITY_LIST = [
//   {
//     country: "Afghanistan",
//     cities: ["Kabul", "Herat"],
//   },
//   {
//     country: "Albania",
//     cities: ["Tirana", "Durrës"],
//   },
//   {
//     country: "Algeria",
//     cities: ["Algiers", "Oran"],
//   },
//   {
//     country: "Andorra",
//     cities: ["Andorra la Vella", "Escaldes-Engordany"],
//   },
//   {
//     country: "Angola",
//     cities: ["Luanda", "Lobito"],
//   },
//   {
//     country: "Argentina",
//     cities: ["Buenos Aires", "Córdoba"],
//   },
//   {
//     country: "Armenia",
//     cities: ["Yerevan", "Gyumri"],
//   },
//   {
//     country: "Australia",
//     cities: ["Sydney", "Melbourne"],
//   },
//   {
//     country: "Austria",
//     cities: ["Vienna", "Graz"],
//   },
//   {
//     country: "Azerbaijan",
//     cities: ["Baku", "Ganja"],
//   },
//   {
//     country: "Bahamas",
//     cities: ["Nassau", "Freeport"],
//   },
//   {
//     country: "Bahrain",
//     cities: ["Manama", "Riffa"],
//   },
//   {
//     country: "Bangladesh",
//     cities: ["Dhaka", "Chittagong"],
//   },
//   {
//     country: "Belarus",
//     cities: ["Minsk", "Gomel"],
//   },
//   {
//     country: "Belgium",
//     cities: ["Brussels", "Antwerp"],
//   },
//   {
//     country: "Belize",
//     cities: ["Belize City", "San Ignacio"],
//   },
//   {
//     country: "Benin",
//     cities: ["Porto-Novo", "Cotonou"],
//   },
//   {
//     country: "Bhutan",
//     cities: ["Thimphu", "Phuntsholing"],
//   },
//   {
//     country: "Bolivia",
//     cities: ["La Paz", "Santa Cruz"],
//   },
//   {
//     country: "Bosnia and Herzegovina",
//     cities: ["Sarajevo", "Banja Luka"],
//   },
//   {
//     country: "Botswana",
//     cities: ["Gaborone", "Francistown"],
//   },
//   {
//     country: "Brazil",
//     cities: ["São Paulo", "Rio de Janeiro"],
//   },
//   {
//     country: "Bulgaria",
//     cities: ["Sofia", "Plovdiv"],
//   },
//   {
//     country: "Canada",
//     cities: ["Toronto", "Vancouver"],
//   },
//   {
//     country: "Chile",
//     cities: ["Santiago", "Valparaíso"],
//   },
//   {
//     country: "China",
//     cities: ["Beijing", "Shanghai"],
//   },
//   {
//     country: "Colombia",
//     cities: ["Bogotá", "Medellín"],
//   },
//   {
//     country: "Costa Rica",
//     cities: ["San José", "Alajuela"],
//   },
//   {
//     country: "Croatia",
//     cities: ["Zagreb", "Split"],
//   },
//   {
//     country: "Cuba",
//     cities: ["Havana", "Santiago de Cuba"],
//   },
//   {
//     country: "Cyprus",
//     cities: ["Nicosia", "Limassol"],
//   },
//   {
//     country: "Czech Republic",
//     cities: ["Prague", "Brno"],
//   },
//   {
//     country: "Denmark",
//     cities: ["Copenhagen", "Aarhus"],
//   },
//   {
//     country: "Ecuador",
//     cities: ["Quito", "Guayaquil"],
//   },
//   {
//     country: "Egypt",
//     cities: ["Cairo", "Alexandria"],
//   },
//   {
//     country: "El Salvador",
//     cities: ["San Salvador", "Santa Ana"],
//   },
//   {
//     country: "Estonia",
//     cities: ["Tallinn", "Tartu"],
//   },
//   {
//     country: "Ethiopia",
//     cities: ["Addis Ababa", "Dire Dawa"],
//   },
//   {
//     country: "Finland",
//     cities: ["Helsinki", "Espoo"],
//   },
//   {
//     country: "France",
//     cities: ["Paris", "Marseille"],
//   },
//   {
//     country: "Germany",
//     cities: ["Berlin", "Hamburg"],
//   },
//   {
//     country: "Greece",
//     cities: ["Athens", "Thessaloniki"],
//   },
//   {
//     country: "Guatemala",
//     cities: ["Guatemala City", "Quetzaltenango"],
//   },
//   {
//     country: "Honduras",
//     cities: ["Tegucigalpa", "San Pedro Sula"],
//   },
//   {
//     country: "Hungary",
//     cities: ["Budapest", "Debrecen"],
//   },
//   {
//     country: "Iceland",
//     cities: ["Reykjavik", "Kopavogur"],
//   },
//   {
//     country: "India",
//     cities: ["New Delhi", "Mumbai"],
//   },
//   {
//     country: "Indonesia",
//     cities: ["Jakarta", "Surabaya"],
//   },
//   {
//     country: "Iran",
//     cities: ["Tehran", "Mashhad"],
//   },
//   {
//     country: "Iraq",
//     cities: ["Baghdad", "Basra"],
//   },
//   {
//     country: "Ireland",
//     cities: ["Dublin", "Cork"],
//   },
//   {
//     country: "Israel",
//     cities: ["Jerusalem", "Tel Aviv"],
//   },
//   {
//     country: "Italy",
//     cities: ["Rome", "Milan"],
//   },
//   {
//     country: "Jamaica",
//     cities: ["Kingston", "Montego Bay"],
//   },
//   {
//     country: "Japan",
//     cities: ["Tokyo", "Osaka"],
//   },
//   {
//     country: "Jordan",
//     cities: ["Amman", "Zarqa"],
//   },
//   {
//     country: "Kazakhstan",
//     cities: ["Nur-Sultan", "Almaty"],
//   },
//   {
//     country: "Kenya",
//     cities: ["Nairobi", "Mombasa"],
//   },
//   {
//     country: "Latvia",
//     cities: ["Riga", "Daugavpils"],
//   },
//   {
//     country: "Lebanon",
//     cities: ["Beirut", "Tripoli"],
//   },
//   {
//     country: "Mexico",
//     cities: ["Mexico City", "Guadalajara"],
//   },
//   {
//     country: "Netherlands",
//     cities: ["Amsterdam", "Rotterdam"],
//   },
//   {
//     country: "New Zealand",
//     cities: ["Auckland", "Wellington"],
//   },
//   {
//     country: "Nigeria",
//     cities: ["Lagos", "Abuja"],
//   },
//   {
//     country: "Norway",
//     cities: ["Oslo", "Bergen"],
//   },
//   {
//     country: "Pakistan",
//     cities: ["Karachi", "Lahore"],
//   },
//   {
//     country: "Peru",
//     cities: ["Lima", "Arequipa"],
//   },
//   {
//     country: "Philippines",
//     cities: ["Manila", "Cebu City"],
//   },
//   {
//     country: "Poland",
//     cities: ["Warsaw", "Krakow"],
//   },
//   {
//     country: "Portugal",
//     cities: ["Lisbon", "Porto"],
//   },
//   {
//     country: "Russia",
//     cities: ["Moscow", "Saint Petersburg"],
//   },
//   {
//     country: "Saudi Arabia",
//     cities: ["Riyadh", "Jeddah"],
//   },
//   {
//     country: "South Africa",
//     cities: ["Johannesburg", "Cape Town"],
//   },
//   {
//     country: "South Korea",
//     cities: ["Seoul", "Busan"],
//   },
//   {
//     country: "Spain",
//     cities: ["Madrid", "Barcelona"],
//   },
//   {
//     country: "Sweden",
//     cities: ["Stockholm", "Gothenburg"],
//   },
//   {
//     country: "Switzerland",
//     cities: ["Zurich", "Geneva"],
//   },
//   {
//     country: "Turkey",
//     cities: ["Istanbul", "Ankara"],
//   },
//   {
//     country: "United Kingdom",
//     cities: ["London", "Manchester"],
//   },
//   {
//     country: "United States",
//     cities: ["New York", "Los Angeles"],
//   },
//   {
//     country: "Venezuela",
//     cities: ["Caracas", "Maracaibo"],
//   },
// ];
