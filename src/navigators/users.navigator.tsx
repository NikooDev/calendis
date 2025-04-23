import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootStackUserType } from '@Calendis/types/stack';
import HomeScreen from '@Calendis/screens/users/home.screen';
import { tabBar, tabOptions, title } from '@Calendis/navigators/options/screen.options';
import MessageScreen from '@Calendis/screens/users/message.screen';
import MapsScreen from '@Calendis/screens/users/maps.screen';
import ProfileScreen from '@Calendis/screens/users/profile.screen';
import MenuScreen from '@Calendis/screens/users/menu.screen';

const Tab = createBottomTabNavigator<RootStackParamList<RootStackUserType>>();

const UsersNavigator = () => {
	return (
		<Tab.Navigator initialRouteName="Home" backBehavior="initialRoute" tabBar={tabBar} screenOptions={tabOptions}>
			<Tab.Screen name="Home" options={{ title: title.home }} initialParams={{ screen: title.home }} component={HomeScreen}/>
			<Tab.Screen name="Message" options={{ title: title.message }} initialParams={{ screen: title.message }} component={MessageScreen}/>
			<Tab.Screen name="Maps" options={{ title: title.maps, headerShown: false }} initialParams={{ screen: title.maps }} component={MapsScreen}/>
			<Tab.Screen name="Profile" options={{ title: title.profile }} initialParams={{ screen: title.profile }} component={ProfileScreen}/>
			<Tab.Screen name="Menu" options={{ title: title.menu }} initialParams={{ screen: title.menu }} component={MenuScreen}/>
		</Tab.Navigator>
	)
}

export default UsersNavigator;
