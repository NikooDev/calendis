import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Animated, { FadeInDown, FadeInUp, SlideInUp } from 'react-native-reanimated';
import { RootStackPropsGuest } from '@Calendis/types/stack';
import ScreenLayout from '@Calendis/components/layouts/screen.layout';
import Gradient from '@Calendis/components/ui/gradient';
import useScreen from '@Calendis/hooks/useScreen';
import Text from '@Calendis/components/ui/text';
import Button from '@Calendis/components/ui/button';
import { shadow, shadowText } from '@Calendis/assets/theme';

const HomeScreen = ({ navigation }: RootStackPropsGuest<'Home'>) => {
	const { width } = Dimensions.get('screen');
	const delayAnimation = 500;

	useScreen('light-content');

	return (
		<ScreenLayout className="px-4 flex-col justify-center" insetBottom>
			<Gradient/>
			<View>
				<Animated.View entering={SlideInUp.duration(1000).delay(delayAnimation)}>
					<Text light size={60} weight="semibold" className="font-title text-center mb-10" style={shadowText}>Calendis</Text>
				</Animated.View>
				<Animated.View entering={FadeInUp.duration(400).delay(delayAnimation + 900)} className="items-center h-52" style={shadow(5, 'center')}>
					<Image source={require('@Calendis/assets/img/logo.png')} className="h-52 w-52 rounded-2xl"/>
				</Animated.View>
				<Animated.View entering={FadeInUp.duration(400).delay(delayAnimation + 1000)} className="mt-12">
					<Text light size={24} weight="semibold" className="font-title text-center" style={shadowText}>La planification connectée</Text>
					<Text light size={20} weight="semibold" className="font-title text-center mt-1.5" style={shadowText}>des tournées de calendriers</Text>
				</Animated.View>
			</View>
			<Animated.View entering={FadeInDown.duration(400).delay(delayAnimation + 1200)} className="w-full mt-10 px-4">
				<Button className="bg-white w-full h-14 pt-0.5 flex justify-center items-center"
								color="none"
								textClass="text-primary font-title uppercase w-full text-center"
								textSize={18}
								style={shadow(3, 'center')}
								onPress={() => navigation.navigate('Login')}>Se connecter</Button>
			</Animated.View>
			<View className="absolute bottom-7" style={{width}}>
				<Text size={12} weight="semibold" className="text-center text-white">Version { DeviceInfo.getVersion() }</Text>
			</View>
		</ScreenLayout>
	)
}

export default HomeScreen;
