import React, { useState } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import BottomMenu from '@Calendis/components/navigator/bottomMenu';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown, withTiming } from 'react-native-reanimated';
import useBottomTabs from '@Calendis/hooks/useBottomTabs';
import { twMerge } from 'tailwind-merge';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '@Calendis/components/ui/text';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const Tabs = (props: BottomTabBarProps) => {
	const [pressIndex, setPressIndex] = useState<number | null>(null);
	const { width } = Dimensions.get('screen');
	const originalWidth = 450;
	const originalHeight = 153;
	const aspectRatio = originalWidth / originalHeight;
	const { state, navigation } = props;

	const { overlayOpacity, displayIcon, overlayStyle } = useBottomTabs();

	const handlePressIn = (index: number, isFocused: boolean) => {
		if (!isFocused) {
			setPressIndex(index);
			overlayOpacity.value = withTiming(1, { duration: 200 });
		}
	}

	const handlePressOut = (routeName: string, screenName: string, routeKey: string, isFocused: boolean) => {
		let timer: ReturnType<typeof setTimeout>;

		const event = navigation.emit({
			type: 'tabPress',
			target: routeKey,
			canPreventDefault: true
		});

		overlayOpacity.value = withTiming(0, { duration: 200, easing: Easing.linear });
		timer = setTimeout(() => setPressIndex(null), 300);

		if (!isFocused && !event.defaultPrevented) {
			clearTimeout(timer);

			navigation.navigate(routeName, { screen: screenName });
		}
	}

	const offsetButton = (index: number) => {
		let marginLeft: number = 0;

		switch (index) {
			case 1:
			case 4:
				marginLeft = -16;
				break;
		}

		return marginLeft;
	}

	return (
		<View className="absolute bottom-0">
			<View pointerEvents="box-none" style={{width, aspectRatio}}>
				<BottomMenu/>
			</View>
			<View className="flex-row justify-around absolute top-1/2 w-full">
				{
					state.routes.map((route, index) => {
						const { icon, title } = displayIcon(route);
						const screen = (route.params as { screen?: string })?.screen ?? route.name;
						const isFocused = state.index === index;
						const offset = offsetButton(index);
						const offsetAddButton = index === 2 && '-mt-[24.3px]';
						const buttonClass = 'flex-1 items-center justify-center flex-col rounded-full h-16 bottom-5 relative';

						console.log(route.name, screen, route.key, isFocused);

						return (
							<Pressable key={index}
												 onPressIn={() => handlePressIn(index, isFocused)}
												 onPressOut={() => handlePressOut(route.name, screen, route.key, isFocused)}
												 className={twMerge(buttonClass, offsetAddButton)}
												 style={{marginLeft: offset}}>
								<View className={twMerge('items-center', index !== 2 && 'py-3 h-16 w-16')}>
									{
										pressIndex === index && index !== 2 && (
											<Animated.View className="rounded-2xl overflow-hidden" style={[StyleSheet.absoluteFillObject, {flex: 1}, overlayStyle]}>
												<LinearGradient colors={['#cbd5e1', '#fff']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFillObject, {flex: 1}]}/>
											</Animated.View>
										)
									}
									<View className={twMerge(index === 2 && 'rounded-full items-center justify-center h-16 w-16')}>
										<Animated.View entering={FadeIn.duration(150)}
																	 exiting={FadeOut.duration(150)}
																	 key={isFocused ? icon : icon + '-outline'}>
											<AnimatedIcon name={index === 2 ? icon : isFocused ? icon : icon + '-outline'}
																		color={isFocused ? '#233aae' : index === 2 ? '#334155' : '#334155'}
																		className={twMerge(index === 2 && 'mr-1 mt-1.5')}
																		size={index === 2 ? 40 : 24}/>
										</Animated.View>
									</View>
									{
										index !== 2 && (
											<Text size={10}
												 weight="semibold"
												 className={twMerge('text-slate-700 mt-0.5', isFocused && 'text-primary')}>
												{ title }
											</Text>
										)
									}
									{
										isFocused && index !== 2 && (
											<Animated.View entering={FadeInDown.duration(200)}
																		 exiting={FadeOutDown.duration(200)}
																		 className="bg-primary h-1 w-4 rounded-full flex absolute bottom-0"/>
										)
									}
								</View>
							</Pressable>
						)
					})
				}
			</View>
		</View>
	);
};

export default Tabs;
