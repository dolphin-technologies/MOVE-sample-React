import React from 'react';
import { View, Text, StyleSheet, Platform, AppStateStatus } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

import PermissionItem from './PermissionItem';

type PermissionsProps = {
	appState: AppStateStatus;
};

const Permissions = ({ appState }: PermissionsProps) => {
	return (
		<View>
			<Text style={styles.title}>PERMISSIONS</Text>
			<Text style={styles.text}>MOVE needs the following permissions to record your activities. Please check each one and grant them.</Text>

			{Platform.OS === 'ios' ? (
				<>
					<PermissionItem
						title={'LOCATION'}
						description={'MOVE needs the location permission to track user trips and activities'}
						permission={PERMISSIONS.IOS.LOCATION_WHEN_IN_USE}
						additionalPermission={PERMISSIONS.IOS.LOCATION_ALWAYS}
						appState={appState}
					/>

					<PermissionItem
						title={'MOTION'}
						description={'MOVE needs the motion permission in order to record walking activities, please grant access to your fitness & motion data.'}
						permission={PERMISSIONS.IOS.MOTION}
						appState={appState}
					/>
				</>
			) : (
				<>
					<PermissionItem
						title={'LOCATION'}
						description={'MOVE needs the location permission to track user trips and activities'}
						permission={PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION}
						additionalPermission={Platform.OS === 'android' && Platform.Version >= 29 ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION : null}
						appState={appState}
					/>

					{Platform.OS === 'android' && Platform.Version >= 29 && (
						<PermissionItem
							title={'MOTION'}
							description={'MOVE needs the motion permission in order to record walking activities, please grant access to your fitness & motion data.'}
							permission={PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION}
							appState={appState}
						/>
					)}

					<PermissionItem
						title={'Phone Calls'}
						description={'The app wants to know if you make phone calls to track your phone usage while driving.'}
						permission={PERMISSIONS.ANDROID.READ_PHONE_STATE}
						appState={appState}
					/>

					{Platform.OS === 'android' && Platform.Version >= 23 && (
						<>
							<PermissionItem
								title={'Display over other Apps'}
								description={'The app wants to be able to display over other apps to detect your phone usage.'}
								customPermission="drawOverlay"
								appState={appState}
							/>

							<PermissionItem title={'Disable Battery Optimization'} description={'The app needs to be able to stay active in the background.'} customPermission="battery" appState={appState} />
						</>
					)}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingTop: 10,
	},
	text: {
		textAlign: 'center',
		marginBottom: 10,
	},
});

export default Permissions;
