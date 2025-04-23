import React from 'react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { RootStackUserType } from '@Calendis/types/stack';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadow } from '@Calendis/assets/theme';
import Text from '@Calendis/components/ui/text';
import { twMerge } from 'tailwind-merge';

const Header = (props: BottomTabHeaderProps) => {
	const { route, options } = props;
	const { top } = useSafeAreaInsets();
	const screenName = route.name as keyof RootStackUserType;
	const isHome = screenName === 'Home';

	return (
		<View className="bg-white flex-row items-center justify-between px-4 pb-2" style={[{height: 100, paddingTop: top + 10}, shadow(1, 'center')]}>
			<View className="flex-row items-center">
				<Text size={isHome ? 28 : 24} weight="bold" className={twMerge(isHome && 'font-title text-primary')}>
					{ options.title }
				</Text>
			</View>
		</View>
	);
};

export default Header;
