import MoveSdk, { MoveSdkAuth } from 'react-native-move-sdk';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { check, Permission, PERMISSIONS } from 'react-native-permissions';

import { ANDROID_CONFIG, CONFIG } from '../config/MoveSdkConfig';
import { getMoveSdkData } from './user';

export const checkPermissions = async () => {
	const iosPermissions: Array<Permission> = [PERMISSIONS.IOS.LOCATION_ALWAYS];
	const androidPermissions: Array<Permission> = [PERMISSIONS.ANDROID.READ_PHONE_STATE];

	if (Device.isDevice) {
		iosPermissions.push(PERMISSIONS.IOS.MOTION);
	}

	let checkPermissions: Array<Permission> = [];
	let hasPermissions = false;
	if (Platform.OS === 'android') {
		if (Platform.Version >= 29) {
			androidPermissions.push(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
			androidPermissions.push(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
		} else {
			androidPermissions.push(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
		}
		checkPermissions = androidPermissions;
	} else if (Platform.OS === 'ios') {
		checkPermissions = iosPermissions;
	}
	try {
		hasPermissions = (await Promise.all([...checkPermissions.map((permission) => check(permission))])).every((p) => p === 'granted');

		if (Platform.OS === 'android') {
			const hasOverlayPermission = await MoveSdk.canDrawOverlays();
			let isAppIgnoringBatteryOptimization = true;
			if (Platform.Version > 30) {
				isAppIgnoringBatteryOptimization = await MoveSdk.isAppIgnoringBatteryOptimization();
			}

			hasPermissions = hasPermissions && hasOverlayPermission && isAppIgnoringBatteryOptimization;
		}
	} catch (error) {
		console.log('catch hasPermissions', error);
	}

	return hasPermissions;
};

export async function initMoveSdk() {
	const initialState = await MoveSdk.getState();

	if (initialState === MoveSdk.UNINITIALIZED) {
		const { userId, accessToken, refreshToken, projectId } = await getMoveSdkData();
		const auth: MoveSdkAuth = {
			userId: userId,
			accessToken: accessToken,
			refreshToken: refreshToken,
			projectId: +projectId,
		};

		try {
			await MoveSdk.setup(CONFIG, auth, ANDROID_CONFIG);
		} catch (error) {
			console.log('MoveSdk error', error);
		}
	}
}

export default { checkPermissions, initMoveSdk };
