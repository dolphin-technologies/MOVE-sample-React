import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoveSdkAuth } from 'react-native-move-sdk';
import { API_TOKEN, URL } from './api';

const registerUser = async (userId: string) => {
	try {
		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_TOKEN}`,
			},
			body: JSON.stringify({ userId }),
		});
		const data = await response.json();
		return data;
	} catch (err) {
		console.log('catch registerUser', err);
	}
};

export const getMoveSdkData = async (): Promise<MoveSdkAuth> => {
	let userId: string, accessToken: string, refreshToken: string, projectId: string;
	try {
		userId = await AsyncStorage.getItem('userId');
		accessToken = await AsyncStorage.getItem('accessToken');
		refreshToken = await AsyncStorage.getItem('refreshToken');
		projectId = await AsyncStorage.getItem('projectId');
	} catch (err) {
		await AsyncStorage.multiRemove(['userId', 'projectId', 'accessToken', 'refreshToken']);
	}

	if (userId && accessToken && refreshToken && projectId) {
		return { userId, accessToken, refreshToken, projectId: +projectId };
	}

	const user = await registerUser(Math.random().toString().substring(2, 9));
	await AsyncStorage.multiSet([
		['userId', user.userId],
		['accessToken', user.accessToken],
		['refreshToken', user.refreshToken],
		['projectId', `${user.projectId}`],
	]);
	return { userId: user.userId, accessToken: user.accessToken, refreshToken: user.refreshToken, projectId: user.projectId };
};
