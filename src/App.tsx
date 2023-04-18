import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Button, Platform } from 'react-native';
import MoveSdk from 'react-native-move-sdk';

import useMoveSdk from './hooks/useMoveSdk';
import Permissions from './components/Permissions';
import CurrentMoveState from './components/CurrentMoveState';

const App = () => {
	const { appState, sdkState, tripState, authState } = useMoveSdk();

	return (
		<>
			<SafeAreaView style={styles.safeArea} />
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>MOVE.</Text>
				</View>
				<CurrentMoveState appState={appState} sdkState={sdkState} />
				<ScrollView>
					<Permissions appState={appState} />
					<View style={styles.bottomStatusContainer}>
						<Text>
							<Text style={{ fontWeight: 'bold' }}>SDK STATE: </Text>
							{sdkState}
						</Text>
						<Text>
							<Text style={{ fontWeight: 'bold' }}>SDK TRIP STATE: </Text>
							{tripState}
						</Text>
						<Text>
							<Text style={{ fontWeight: 'bold' }}>SDK AUTH STATE: </Text>
							{authState}
						</Text>
					</View>
					<View style={{ marginBottom: 40 }}>
						<Button
							onPress={async () => {
								MoveSdk.shutdown();
							}}
							title="SHUTDOWN"
						/>
					</View>
				</ScrollView>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 0,
		backgroundColor: '#061230',
	},
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: Platform.OS === 'android' ? 30 : 10,
		paddingBottom: 10,
		backgroundColor: '#061230',
	},
	headerText: {
		fontSize: 18,
		color: '#ffffff',
	},
	statusContainer: {
		backgroundColor: '#f34d5c',
		padding: 20,
	},
	statusText: {
		fontWeight: 'bold',
		color: '#ffffff',
		fontSize: 16,
		marginBottom: 20,
	},
	statusCard: {
		backgroundColor: '#f3f3f3',
		borderRadius: 15,
		padding: 10,
	},
	cardText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	bottomStatusContainer: {
		backgroundColor: '#f3f3f3',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
});

export default App;
