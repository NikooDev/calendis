import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Header from '@Calendis/components/navigator/header';
import Tabs from '@Calendis/components/navigator/tabs';

export const title = {
	round: 'Tournée',
	message: 'Messages',
	maps: 'Maps',
	settings: 'Paramètres',
	profile: 'Profil',
}

export const screenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	animationTypeForReplace: 'pop'
};

export const tabOptions: BottomTabNavigationOptions = {
	animation: 'shift',
	headerShadowVisible: false,
	header: (props) => <Header {...props} />
}

export const tabBar = (props: BottomTabBarProps) => <Tabs {...props}/>;
