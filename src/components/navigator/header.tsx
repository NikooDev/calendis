import React from 'react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadow } from '@Calendis/assets/theme';
import Text from '@Calendis/components/ui/text';

const Header = (props: BottomTabHeaderProps) => {
	const { options } = props;
	const { top } = useSafeAreaInsets();

	return (
		<View className="bg-white flex-row items-center justify-between px-4 pb-2" style={[{height: 100, paddingTop: top + 10}, shadow(1, 'center')]}>
			<View className="flex-row items-center">
				<Text size={28} weight="bold" className="font-title text-primary">
					{ options.title }
				</Text>
			</View>
		</View>
	);
};

export default Header;
