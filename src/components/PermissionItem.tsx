import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, AppStateStatus, Platform } from 'react-native';
import { AndroidPermission, check, checkLocationAccuracy, LocationAccuracy, Permission, PERMISSIONS, PermissionStatus, request, RESULTS } from 'react-native-permissions';
import MoveSdk from 'react-native-move-sdk';

import PermissionStateButton from './PermissionStateButton';

export type CustomPermissionType = 'drawOverlay' | 'battery';

export type RequestPermissionType = {
	permission: Permission | null;
	additional?: boolean;
	customPermission?: CustomPermissionType;
};

export type PermissionItemProps = {
	title: string;
	description: string;
	permission?: Permission;
	additionalPermission?: Permission | null;
	customPermission?: CustomPermissionType;
	appState: AppStateStatus;
};

const PermissionItem = ({ title, description, permission, additionalPermission, appState, customPermission }: PermissionItemProps) => {
	const [result, setResult] = useState<PermissionStatus>(RESULTS.UNAVAILABLE);
	const [resultDrawOverlays, setResultDrawOverlays] = useState(false);
	const [resultBattery, setResultBattery] = useState(false);
	const [locationAccuracy, setLocationAccuracy] = useState<LocationAccuracy>('full');
	const [blockedAndroidPermissions, setBlockedAndroidPermissions] = useState<AndroidPermission[]>([]);
	useEffect(() => {
		if (appState === 'active' && permission) {
			check(permission)
				.then((result) => {
					if (Platform.OS === 'android' && result === RESULTS.GRANTED && blockedAndroidPermissions.includes(permission as AndroidPermission)) {
						setBlockedAndroidPermissions((prev) => prev.filter((item) => item !== permission));
					}
					if (result === RESULTS.GRANTED && additionalPermission) {
						check(additionalPermission)
							.then((result) => {
								setResult(result);

								if (Platform.OS === 'ios' && Number(Platform.Version.split('.')[0]) > 14 && result === RESULTS.GRANTED) {
									checkLocationAccuracy()
										.then((accuracy) => {
											setLocationAccuracy(accuracy);
										})
										.catch(() => console.warn('Cannot check location accuracy'));
								}
							})
							.catch((error) => {
								console.log('error', error);
							});
					} else {
						setResult(result);
					}
				})
				.catch((error) => {
					console.log('error', error);
				});
		}
	}, [permission, additionalPermission, appState, blockedAndroidPermissions]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		if (appState === 'active' || !appState) {
			if (customPermission === 'drawOverlay') {
				MoveSdk.canDrawOverlays().then((result: boolean) => {
					setResultDrawOverlays(result);
				});
			}
			if (customPermission === 'battery') {
				timeout = setTimeout(() => {
					// timeout for fix check on some xiaomi and redmi devices
					MoveSdk.isAppIgnoringBatteryOptimization().then((result: boolean) => {
						setResultBattery(result);
					});
				}, 1000);
			}
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [appState, customPermission]);

	const requestPermission =
		({ permission, customPermission, additional }: RequestPermissionType) =>
		() => {
			if (customPermission) {
				if (customPermission === 'drawOverlay') {
					MoveSdk.requestDrawOverlaysPermission();
				}
				if (customPermission === 'battery') {
					MoveSdk.requestAppIgnoringBatteryOptimization();
				}
			} else if (permission) {
				request(permission)
					.then((result) => {
						if (Platform.OS === 'android' && result === RESULTS.BLOCKED && !blockedAndroidPermissions.includes(permission as AndroidPermission)) {
							setBlockedAndroidPermissions((prev) => [...prev, permission as AndroidPermission]);
						}
						if (result === RESULTS.GRANTED && additionalPermission && !additional) {
							requestPermission({ permission: additionalPermission, additional: true })();
						} else {
							setResult(result);
						}
					})
					.catch((error) => {
						console.log('error', error);
					});
			}
		};

	const granted = useMemo(() => {
		if (customPermission === 'drawOverlay') {
			return resultDrawOverlays;
		}
		if (customPermission === 'battery') {
			return resultBattery;
		}

		if (Platform.OS === 'ios' && Number(Platform.Version.split('.')[0]) > 14 && permission === PERMISSIONS.IOS.LOCATION_WHEN_IN_USE) {
			return locationAccuracy === 'full' && result === RESULTS.GRANTED;
		}
		return result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE;
	}, [result, resultDrawOverlays, resultBattery, customPermission, locationAccuracy, permission]);

	return (
		<View style={styles.wrapper}>
			<View style={styles.permissionCard}>
				<View style={styles.firstBlock}>
					<Text style={styles.permissionText}>{title}</Text>
					<PermissionStateButton
						requestPermission={requestPermission}
						permission={permission}
						customPermission={customPermission}
						result={result}
						resultDrawOverlays={customPermission === 'drawOverlay' ? resultDrawOverlays : null}
						resultBattery={customPermission === 'battery' ? resultBattery : null}
						isBlocked={blockedAndroidPermissions.includes(permission as AndroidPermission)}
						locationAccuracy={locationAccuracy}
					/>
				</View>
				<View style={{ minHeight: 30 }}>
					<Text style={styles.permissionDescription}>{description}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		marginBottom: 10,
		paddingHorizontal: 16,
	},
	permissionCard: {
		backgroundColor: '#f3f3f3',
		borderRadius: 15,
		padding: 10,
	},
	firstBlock: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#ffffff',
		padding: 10,
	},
	permissionText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	permissionDescription: {
		fontSize: 12,
		color: '#808080',
		padding: 10,
	},
});

export default PermissionItem;
