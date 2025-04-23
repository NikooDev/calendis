import React from 'react';
import { LayoutInterface } from '@Calendis/types/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const ScreenLayout: React.FC<LayoutInterface> = ({
	children,
	style,
	className,
	insetBottom,
	insetTop
}) => {
	const insets = useSafeAreaInsets();
	const pt = insetTop && { paddingTop: insets.top };
	const pb = insetBottom && { paddingBottom: insets.bottom };

	return (
		<View className={ twMerge('flex-1', className) } style={ [style, pt, pb] }>
			{ children }
		</View>
	);
};

export default ScreenLayout;
