import React, { useCallback, useEffect, useState } from 'react';
import ScreenLayout from '@Calendis/components/layouts/screen.layout';
import MapView, { Region } from 'react-native-maps';
import { Alert, GestureResponderEvent, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { haptic } from '@Calendis/utils/functions';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { BlurView } from '@react-native-community/blur';

const MapsScreen = () => {
	const [coordsGeolocation, setCoordsGeolocation] = useState<Region>();
	const [permissionGeolocation, setPermissionGeolocation] = useState<boolean | undefined>(undefined);
	const [userLocationChange, setUserLocationChange] = useState<boolean>(false)

	const handleRequestAuthorization = useCallback(() => {
		Geolocation.requestAuthorization(
			() => {
				handleCurrentPosition();
			},
			(error) => {
				if (error.PERMISSION_DENIED === 1) {
					setPermissionGeolocation(false);
				}
			}
		)
	}, []);

	useEffect(() => handleRequestAuthorization(), [handleRequestAuthorization]);

	const handleCurrentPosition = (event?: GestureResponderEvent) => {
		if (!permissionGeolocation) {
			if (event) {
				Alert.alert('Géolocalisation refusée', 'Vous devez autoriser l\'accès à votre position pour vous localiser sur la map.')
			}
		}
		if (event && userLocationChange) {
			haptic(HapticFeedbackTypes.impactLight)
		}
		Geolocation.getCurrentPosition(
			(position) => {
				const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: .3, longitudeDelta: .3 }

				setPermissionGeolocation(true)
				setUserLocationChange(false)
				setCoordsGeolocation(coords)
			},
			() => {
				setPermissionGeolocation(false)
			}
		)
	}

	return (
		<ScreenLayout>
			<MapView initialRegion={coordsGeolocation}
							 showsUserLocation
							 style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
			</MapView>
			<BlurView blurType="light" overlayColor="transparent" blurAmount={8} style={{height: 45}}/>
		</ScreenLayout>
	);
};

export default MapsScreen;
