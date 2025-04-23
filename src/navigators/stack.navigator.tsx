import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackGuestType, RootStackParamList } from '@Calendis/types/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '@Calendis/screens/guest/home.screen';
import LoginScreen from '@Calendis/screens/guest/login.screen';
import { NavigatorTheme } from '@Calendis/assets/theme';
import { screenOptions } from '@Calendis/navigators/options/screen.options';
import { shallowEqual, useSelector } from 'react-redux';
import { RootStateType } from '@Calendis/types/store';
import useAuth from '@Calendis/hooks/useAuth';
import { AuthEnum } from '@Calendis/types/auth';
import LoaderLayout from '@Calendis/components/layouts/loader.layout';
import UsersNavigator from '@Calendis/navigators/users.navigator';

const Stack = createNativeStackNavigator<RootStackParamList<RootStackGuestType>>();

const StackNavigator = () => {
	useAuth();

	const { isAuth } = useSelector((state: RootStateType) => state.auth, shallowEqual);
	const isLoading = (isAuth === AuthEnum.LOGGED_LOADING);
	const unAuthencated = (isAuth === AuthEnum.LOGGED_OUT) || (isAuth === AuthEnum.LOGGED_ERROR);

	return (
		<LoaderLayout loading={isLoading} isAuth={isAuth}>
			<NavigationContainer theme={NavigatorTheme}>
				<Stack.Navigator initialRouteName={unAuthencated ? 'Home' : 'Users'} screenOptions={screenOptions}>
					{
						unAuthencated ? (
							<Stack.Group>
								<Stack.Screen name="Home" component={HomeScreen}/>
								<Stack.Screen name="Login" component={LoginScreen}/>
							</Stack.Group>
						) : (
							<Stack.Group>
								<Stack.Screen name="Users" component={UsersNavigator}/>
							</Stack.Group>
						)
					}
				</Stack.Navigator>
			</NavigationContainer>
		</LoaderLayout>
	)
}

export default StackNavigator;
