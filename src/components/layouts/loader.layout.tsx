import React, { useEffect, useState } from 'react';
import { LoaderEnum, LoaderLayoutInterface } from '@Calendis/types/layout';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import Gradient from '@Calendis/components/ui/gradient';
import Text from '@Calendis/components/ui/text';
import { AuthEnum } from '@Calendis/types/auth';
import { shadowText } from '@Calendis/assets/theme';

export const loaderTimeout = 800;

const Loader: React.FC<{ loading: boolean }> = ({ loading }) => {
	const [state, setState] = useState<LoaderEnum>(LoaderEnum.WAITFORREADY);
	const opacity = useSharedValue(1);

	useEffect(() => {
		if (state === LoaderEnum.WAITFORREADY) {
			if (loading) {
				setState(LoaderEnum.FADEOUT);
			}
		}
	}, [state, loading]);

	useEffect(() => {
		if (state === LoaderEnum.FADEOUT) {
			opacity.value = withDelay(loaderTimeout, withTiming(0, { duration: 400 }, () => {
				runOnJS(setState)(LoaderEnum.HIDDEN);
			}));
		}
	}, [state, opacity]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	if (state === LoaderEnum.HIDDEN) return null;

	return (
		<Animated.View collapsable={false} className="justify-center items-center" style={[StyleSheet.absoluteFillObject, animatedStyle]}>
			<StatusBar barStyle="light-content" animated/>
			<Gradient/>
			<View className="-mt-14">
				<Text size={60} light className="font-title text-center mb-4" style={shadowText}>Calendis</Text>
				<ActivityIndicator size="large" color="#fff"/>
			</View>
		</Animated.View>
	)
}

const LoaderLayout: React.FC<LoaderLayoutInterface> = ({
	children,
	loading,
	isAuth
}) => {
	return (
		<>
			<StatusBar barStyle={isAuth === AuthEnum.LOGGED_IN ? 'dark-content' : 'light-content'} animated={true} translucent={true} backgroundColor="transparent"/>
			{ !loading && children }

			<Loader loading={loading}/>
		</>
	);
}

export default LoaderLayout;
