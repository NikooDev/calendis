import React from 'react';
import { ButtonInterface } from '@Calendis/types/ui';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '@Calendis/components/ui/text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<ButtonInterface> = ({
	children,
	color = 'default',
	icon,
	iconSize,
	iconColor,
	iconClass,
	textLight = false,
	textSize,
	textWeight = 'semibold',
	textClass,
	className,
	style,
	...pressableProps
}) => {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	const backgroundStyle = (): string => {
		switch (color) {
			case 'primary':
				return 'bg-primary';
			case 'warn':
				return 'bg-red-500';
			case 'default':
				return 'bg-slate-300';
			case 'none':
				return 'bg-transparent shadow-none';
			default:
				return 'bg-transparent shadow-none';
		}
	}

	const handlePressIn = () => {
		scale.value = withSpring(0.95, { damping: 5, stiffness: 400 });
	}

	const handlePressOut = () => {
		scale.value = withSpring(1, { damping: 15, stiffness: 300 });
	}

	const buttonClass = twMerge('rounded-2xl self-start justify-center', backgroundStyle(), className);

	return (
		<AnimatedPressable {...pressableProps} onPressIn={handlePressIn} onPressOut={handlePressOut} className={buttonClass} style={[animatedStyle, style]}>
			{
				icon && iconSize ? (
					<View className={twMerge('flex-row items-center justify-center', children && 'gap-2')}>
						<Text size={iconSize} light={textLight} className={iconClass}>
							<Icon name={icon} size={iconSize} color={iconColor}/>
						</Text>
						<Text size={textSize} light={textLight} weight={textWeight} className={textClass}>
							{ children }
						</Text>
					</View>
				) : (
					<Text size={textSize} light={textLight} weight={textWeight} className={textClass}>{ children }</Text>
				)
			}
		</AnimatedPressable>
	);
};

export default Button;
