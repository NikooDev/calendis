import React, { useCallback, useEffect } from 'react';
import Firebase from '@Calendis/services/firebase/init';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider } from 'react-redux';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import StackNavigator from '@Calendis/navigators/stack.navigator';
import useDevKeepAwake from '@Calendis/hooks/useDevKeepAwake';
import store from '@Calendis/store';
import '@Calendis/assets/theme/global.css';

const App = () => {
	const initializeFirebase = useCallback(async () => {
		await Firebase.init();
	}, []);

	useEffect(() => {
		initializeFirebase().then(() => {
			console.log('Initialized Firebase');
		});
	}, [initializeFirebase]);

	useDevKeepAwake();

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView className="flex-1">
				<BottomSheetModalProvider>
					<KeyboardProvider statusBarTranslucent={true}>
						<Provider store={store}>
							<StackNavigator/>
						</Provider>
					</KeyboardProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

export default App;
