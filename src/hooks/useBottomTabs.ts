import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';

const UseBottomTabs = () => {
	const overlayOpacity = useSharedValue(0);

	const overlayStyle = useAnimatedStyle(() => {
		return {
			opacity: overlayOpacity.value,
		};
	});

	const displayIcon = (route: NavigationRoute<ParamListBase, string>) => {
		let icon: string, title: string;

		switch (route.name) {
			case 'Round':
				icon = 'footsteps';
				title = 'Tournée';
				break;
			case 'Message':
				icon = 'chatbubble-ellipses';
				title = 'Messages';
				break;
			case 'Maps':
				icon = 'navigate';
				title = '';
				break;
			case 'Profile':
				icon = 'person';
				title = 'Profil';
				break;
			case 'Settings':
				icon = 'settings';
				title = 'Paramètres';
				break;
			default:
				icon = 'help';
				title = 'Invalid'
				break;
		}

		return {
			icon, title
		}
	}

	return {
		displayIcon,
		overlayOpacity,
		overlayStyle
	}
}

export default UseBottomTabs;
