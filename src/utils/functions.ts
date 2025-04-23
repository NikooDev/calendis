import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

export const haptic = (type: HapticFeedbackTypes) => {
	return ReactNativeHapticFeedback.trigger(type, {
		enableVibrateFallback: true,
		ignoreAndroidSystemSettings: false
	})
}
