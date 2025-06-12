import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootStackUserType } from '@Calendis/types/stack';
import RoundScreen from '@Calendis/screens/users/round.screen';
import { tabBar, tabOptions, title } from '@Calendis/navigators/options/screen.options';
import MessageScreen from '@Calendis/screens/users/message.screen';
import MapsScreen from '@Calendis/screens/users/maps.screen';
import ProfileScreen from '@Calendis/screens/users/profile.screen';
import SettingsScreen from '@Calendis/screens/users/settings.screen';

const Tab = createBottomTabNavigator<RootStackParamList<RootStackUserType>>();

const UsersNavigator = () => {
	return (
		<Tab.Navigator initialRouteName="Round" backBehavior="initialRoute" tabBar={tabBar} screenOptions={tabOptions}>
			<Tab.Screen name="Round" options={{ title: title.round }} initialParams={{ screen: title.round }} component={RoundScreen}/>
			<Tab.Screen name="Message" options={{ title: title.message }} initialParams={{ screen: title.message }} component={MessageScreen}/>
			<Tab.Screen name="Maps" options={{ title: title.maps, headerShown: false }} initialParams={{ screen: title.maps }} component={MapsScreen}/>
			<Tab.Screen name="Profile" options={{ title: title.profile }} initialParams={{ screen: title.profile }} component={ProfileScreen}/>
			<Tab.Screen name="Settings" options={{ title: title.settings }} initialParams={{ screen: title.settings }} component={SettingsScreen}/>
		</Tab.Navigator>
	)
}

export default UsersNavigator;
