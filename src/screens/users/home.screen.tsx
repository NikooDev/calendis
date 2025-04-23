import React from 'react';
import { Pressable } from 'react-native';
import Text from '@Calendis/components/ui/text';
import useAuth from '@Calendis/hooks/useAuth';
import ScreenLayout from '@Calendis/components/layouts/screen.layout';

const HomeScreen = () => {
	const { logout } = useAuth();

	return (
		<ScreenLayout>
			<Pressable onPress={logout}><Text size={23}>Déconnexion</Text></Pressable>
		</ScreenLayout>
	);
};

export default HomeScreen;
