import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, TextInput, View } from 'react-native';
import ScreenLayout from '@Calendis/components/layouts/screen.layout';
import Gradient from '@Calendis/components/ui/gradient';
import useScreen from '@Calendis/hooks/useScreen';
import { RootStackPropsGuest } from '@Calendis/types/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Button from '@Calendis/components/ui/button';
import Text from '@Calendis/components/ui/text';
import { twMerge } from 'tailwind-merge';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetTextInput,
	BottomSheetView
} from '@gorhom/bottom-sheet';
import { BottomSheetStyles, isEmail } from '@Calendis/utils/constants';
import { Easing } from 'react-native-reanimated';
import { login } from '@Calendis/actions/auth.actions';
import { setLoginError, setLoginSuccess } from '@Calendis/store/reducers/auth.reducer';
import { useDispatch } from 'react-redux';
import { shadowText } from '@Calendis/assets/theme';

const LoginScreen = ({ navigation }: RootStackPropsGuest<'Login'>) => {
	const [user, setUser] = useState({email: '', password: '', recover: ''});
	const [focus, setFocus] = useState({email: false, password: false});
	const [valid, setValid] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const snapPoints = useMemo(() => ['20%'], []);
	const dispatch = useDispatch();

	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const recoverRef = useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);

	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		setTimeout(() => emailRef.current && emailRef.current.focus(), 600);
	}, [emailRef.current]);

	useEffect(() => {
		if (user.email.length > 0 && user.password.length > 0) {
			setValid(true);
		} else {
			setValid(false);
		}
	}, [user])

	const handleChange = (name: 'email' | 'password' | 'recover', value: string) => {
		setUser({...user, [name]: value});
	}

	const handleFocus = (name: 'email' | 'password') => {
		setFocus({...focus, [name]: true});
	}

	const handleBlur = () => {
		setFocus({email: false, password: false});
	}

	const handleNext = () => {
		if (passwordRef.current) {
			passwordRef.current!.focus();
		}
	}

	const handleSubmit = async () => {
		if (user.email.length === 0 && emailRef.current) {
			emailRef.current.focus();
		} else if (user.password.length === 0 && passwordRef.current) {
			passwordRef.current.focus();
		}

		if (!loading && valid) {
			if (!user.email.match(isEmail)) {
				Alert.alert('Votre adresse e-mail est incorrecte', '', [{
					onPress: () => emailRef.current?.focus()
				}]);

				return;
			} else {
				Keyboard.dismiss();
				setLoading(true);

				try {
					await new Promise(resolve => setTimeout(resolve, 1000));
					const token = await login(user);

					if (token) {
						dispatch(setLoginSuccess());
					}
				} catch (error) {
					let errorMessage = 'Une erreur inattendue s\'est produite.';

					if (error instanceof Error) {
						errorMessage = error.message;
					}

					dispatch(setLoginError());
					setLoading(false);

					Alert.alert('Erreur de connexion', errorMessage, [
						{ text: 'OK' }
					]);
				}
			}
		}
	}

	const openBottomSheet = () => {
		Keyboard.dismiss();
		bottomSheetRef.current!.snapToIndex(0);
	}

	const renderBackdrop = useMemo(
		() => (props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				onPress={() => closeBottomSheet()}/>
		), []
	);

	const closeBottomSheet = () => {
		bottomSheetRef.current!.close();
		Keyboard.dismiss();
	}

	const handleRecover = () => {
		closeBottomSheet();
	}

	useScreen('light-content');

	return (
		<ScreenLayout className="px-4 flex-col justify-center">
			<Gradient/>
			<KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
				<View>
					<View className="mb-16 mt-5">
						<View className="self-start absolute top-2.5 z-20">
							<Button onPress={() => navigation.goBack()}
											children={null}
											textSize={0}
											textLight={true}
											color="none"
											iconSize={40}
											icon="chevron-back-outline"
											className="mt-4 ml-0"/>
						</View>
						<View className="ml-16">
							<Text size={60} light className="font-title" style={shadowText}>Calendis</Text>
							<Text size={24} light className="font-title -mt-2 ml-0.5" style={shadowText}>Connexion</Text>
						</View>
					</View>
					<View>
						<View className={twMerge('bg-[#0000003f] border-[#0000001f] rounded-2xl border mb-3', focus.email && 'bg-[#0000005f] border-[#0000001f]')}>
							<TextInput ref={emailRef}
												 keyboardType="email-address"
												 placeholder="Adresse e-mail"
												 placeholderTextColor="#ffffff8f"
												 returnKeyType="next"
												 textContentType="emailAddress"
												 textAlignVertical="center"
												 autoCapitalize="none"
												 autoCorrect={false}
												 spellCheck={false}
												 className="font-text-regular text-[17px] px-4 text-white h-16"
												 style={{lineHeight: 0}}
												 onFocus={() => handleFocus('email')}
												 onBlur={handleBlur}
												 onSubmitEditing={handleNext}
												 onChangeText={(value) => handleChange('email', value)}/>
						</View>
						<View className={twMerge('bg-[#0000003f] border-[#0000001f] rounded-2xl border mb-3', focus.password && 'bg-[#0000005f] border-[#0000001f]')}>
							<TextInput ref={passwordRef}
												 keyboardType="default"
												 placeholder="Mot de passe"
												 placeholderTextColor="#ffffff8f"
												 returnKeyType="done"
												 textContentType="password"
												 textAlignVertical="center"
												 secureTextEntry={true}
												 autoCorrect={false}
												 className="font-text-regular text-[17px] px-4 text-white h-16"
												 style={{lineHeight: 0}}
												 onFocus={() => handleFocus('password')}
												 onBlur={handleBlur}
												 onSubmitEditing={valid ? handleSubmit : () => null}
												 onChangeText={(value) => handleChange('password', value)}/>
						</View>
						<View className="mt-4">
							<Button color="primary" className="w-full h-14 pt-0.5 justify-center items-center"
											textClass="text-center uppercase flex-row items-center text-white font-title"
											textSize={18}
											disabled={loading}
											onTouchStart={handleSubmit}>
								{
									loading ? (
										<ActivityIndicator color="#fff" size={24}/>
									) : 'Se connecter'
								}
							</Button>
						</View>
						<View className="w-full mt-4">
							<Button color="none" disabled={loading} textSize={16} className="w-full" textClass="text-white text-center" onPress={openBottomSheet}>
								Mot de passe oublié ?
							</Button>
						</View>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<BottomSheet ref={bottomSheetRef} enableDynamicSizing={false} enablePanDownToClose backdropComponent={renderBackdrop} animationConfigs={{ duration: 250, easing: Easing.out(Easing.quad) }} snapPoints={snapPoints} {...BottomSheetStyles}>
				<BottomSheetView className="flex-1 px-4 pt-2 h-40">
					<View className="mb-4">
						<Text size={20} weight="semibold">Retrouver votre compte</Text>
						<Text size={16}>Entrez votre adresse e-mail.</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<BottomSheetTextInput ref={recoverRef}
																	keyboardType="email-address"
																	placeholder="Adresse e-mail"
																	placeholderTextColor="#ffffff"
																	returnKeyType="next"
																	textContentType="emailAddress"
																	textAlignVertical="center"
																	autoCapitalize="none"
																	autoCorrect={false}
																	spellCheck={false}
																	className="bg-slate-700 flex-1 rounded-2xl font-text-regular text-[17px] px-4 text-white h-14"
																	style={{lineHeight: 0}}
																	onSubmitEditing={handleRecover}
																	onChangeText={(value) => handleChange('recover', value)}/>
						<Button onPress={handleRecover} textSize={0} color="primary" icon="send" iconClass="text-white" className="w-16 h-14" iconSize={24} children={null}/>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</ScreenLayout>
	)
}

export default LoginScreen;
