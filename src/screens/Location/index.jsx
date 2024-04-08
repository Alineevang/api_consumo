import styles from "./styles";
import { requestForegroundPermissionsAsync } from "expo-location";

import Title from "../../components/Title";
import { useEffect, useState, useRef } from "react";

import { View } from "react-native";
import { getCurrentPositionAsync } from "expo-location";
import { AnimatedMapView } from "react-native-maps/lib/MapView";
import { MarkerAnimated } from "react-native-maps";
import { watchPositionAsync } from "expo-location";
import { LocationAccuracy } from "expo-location";

export default function Location() {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  async function requestPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log("Localização atual", currentPosition);
      return;
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        console.log("Nova localização", response);
        mapRef.current?.animateCamera({
          center: response.coords,
          pitch: 50,
        });
      }
    );
  }, []);


  return (
    <View style={styles.container}>
      <Title title="Location" />
      {location && (
        <AnimatedMapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <MarkerAnimated
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Você está aqui"
            description="Sua localização atual"
          />
        </AnimatedMapView>
      )}
    </View>
  );
}
