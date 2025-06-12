import React from 'react';
import ScreenLayout from '@Calendis/components/layouts/screen.layout';
import Text from '@Calendis/components/ui/text';
import { Pressable } from 'react-native';
import useAuth from '@Calendis/hooks/useAuth';

const SettingsScreen = () => {
	const { logout } = useAuth();

	return (
		<ScreenLayout>
			<Pressable onPress={logout}><Text size={23}>Déconnexion</Text></Pressable>
		</ScreenLayout>
	);
};

export default SettingsScreen;
