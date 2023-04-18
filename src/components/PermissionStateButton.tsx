import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { RESULTS, openSettings, Permission, PermissionStatus } from 'react-native-permissions';

import { CustomPermissionType, RequestPermissionType } from './PermissionItem';

type PermissionStateButtonType = {
	result: PermissionStatus;
	resultDrawOverlays: boolean | null;
	resultBattery: boolean | null;
	requestPermission: (data: RequestPermissionType) => () => void;
	customPermission?: CustomPermissionType;
	permission?: Permission;
	isBlocked: boolean;
	locationAccuracy?: string;
};

const PermissionStateButton = ({ result, resultDrawOverlays, resultBattery, requestPermission, customPermission, permission, isBlocked, locationAccuracy }: PermissionStateButtonType) => {
	if (result === RESULTS.GRANTED || resultDrawOverlays || resultBattery) {
		if (locationAccuracy === 'reduced') {
			return (
				<Pressable
					onPress={() => {
						openSettings().catch(() => console.warn('Cannot open settings'));
					}}
					style={styles.button}
				>
					<Text style={styles.buttonText}>OPEN SETTINGS</Text>
				</Pressable>
			);
		}
		return (
			<Pressable style={styles.buttonGranted}>
				<Text style={styles.buttonTextGranted}>GRANTED</Text>
			</Pressable>
		);
	}
	if (result === RESULTS.BLOCKED || isBlocked || result === RESULTS.LIMITED) {
		return (
			<Pressable
				onPress={() => {
					openSettings().catch(() => console.warn('Cannot open settings'));
				}}
				style={styles.button}
			>
				<Text style={styles.buttonText}>OPEN SETTINGS</Text>
			</Pressable>
		);
	}

	if (result === RESULTS.DENIED || resultDrawOverlays === false || resultBattery === false) {
		return (
			<Pressable onPress={requestPermission({ customPermission, permission: permission || null })} style={styles.button}>
				<Text style={styles.buttonText}>CONTINUE</Text>
			</Pressable>
		);
	}
	if (result === RESULTS.UNAVAILABLE) {
		return (
			<Pressable
				onPress={() => {
					Alert.alert('This feature is not available on your device');
				}}
				style={styles.button}
			>
				<Text style={styles.buttonText}>UNAVAILABLE</Text>
			</Pressable>
		);
	}

	return <Text style={styles.buttonText}>LOADING</Text>;
};

export default PermissionStateButton;

const styles = StyleSheet.create({
	button: {
		borderWidth: 1,
		borderColor: '#595959',
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	buttonGranted: {
		borderWidth: 1,
		borderColor: '#a3dc70',
		backgroundColor: '#a3dc70',
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	buttonText: {
		color: '#061230',
		minWidth: 70,
		textAlign: 'center',
		fontSize: 12,
	},
	buttonTextGranted: {
		color: '#ffffff',
		minWidth: 70,
		textAlign: 'center',
		fontSize: 12,
	},
});
