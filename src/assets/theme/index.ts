import { DefaultTheme } from '@react-navigation/native';

export const theme = {
	primary: '#0065ff',
	background: '#f0f2f5'
}

export const NavigatorTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: theme.background
	}
}

export const shadow = (elevation: number, direction: 'top' | 'center') => {
	return {
		shadowColor: '#0000007f',
		shadowOffset: {
			width: 0,
			height: direction === 'top' ? 0 : 1
		},
		shadowOpacity: .5,
		shadowRadius: 5,
		elevation: elevation
	}
}
