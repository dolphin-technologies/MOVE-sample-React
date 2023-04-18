import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AppStateStatus, Switch, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MoveSdk, { SdkState } from 'react-native-move-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MoveSdkPermissions from '../services/MoveSdk';

type CurrentMoveStateProps = {
	sdkState: SdkState;
	appState: AppStateStatus;
};

const CurrentMoveState = ({ sdkState, appState }: CurrentMoveStateProps) => {
	const [isMandatoryPermissionsGranted, setIsMandatoryPermissionsGranted] = useState<boolean>(false);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const hasPermissions = async () => {
			setIsMandatoryPermissionsGranted(await MoveSdkPermissions.checkPermissions());
		};

		hasPermissions();
	}, [appState]);

	useEffect(() => {
		AsyncStorage.getItem('userId').then((id) => {
			setUserId(id);
		});
	}, [sdkState]);

	const isRunning = sdkState === MoveSdk.RUNNING;

	const onSwitchChange = async (value: boolean) => {
		if (!isMandatoryPermissionsGranted && value) {
			Alert.alert('Alert', 'Dolphin MOVE needs the following permissions to record your activities. Please check each one and grant them.', [
				{
					text: 'OK',
				},
			]);
			return;
		}
		if (isRunning) {
			MoveSdk.stopAutomaticDetection();
		} else if (sdkState === MoveSdk.READY) {
			MoveSdk.startAutomaticDetection();
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.background}>
				<LinearGradient colors={isRunning ? ['#b4ec51', '#429321'] : ['#f5515f', '#9f041b']} style={{ flex: 1 }} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
			</View>
			<Text style={styles.title}>CURRENT STATE</Text>
			<View style={styles.cardWrapper}>
				<View style={styles.cardUpperPart}>
					<Text style={styles.stateText}>{isRunning ? 'RECORDING' : 'NOT RECORDING'}</Text>
					<Switch onValueChange={onSwitchChange} value={isRunning} />
				</View>
				<View style={styles.cardBottomPart}>
					<Text style={styles.text}>{`Your contract ID: ${userId}`}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	background: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	title: {
		fontWeight: 'bold',
		color: '#ffffff',
		fontSize: 16,
		marginBottom: 20,
	},
	cardWrapper: {
		backgroundColor: '#f3f3f3',
		borderRadius: 15,
		padding: 10,
	},
	cardUpperPart: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#ffffff',
		padding: 10,
	},
	cardBottomPart: {
		paddingHorizontal: 10,
		paddingTop: 10,
	},
	stateText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	text: {
		fontSize: 12,
		color: '#808080',
	},
});

export default CurrentMoveState;
