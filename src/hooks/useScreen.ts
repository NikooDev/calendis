import { StatusBar, StatusBarStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const useScreen = (statusBarStyle: StatusBarStyle) => {
	useFocusEffect(
		useCallback(() => {
			setTimeout(() => StatusBar.setBarStyle(statusBarStyle), 200);
		}, [statusBarStyle])
	);
}

export default useScreen;
