import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import MoveSdk, { ErrorListType, SdkState, TripState } from 'react-native-move-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initMoveSdk } from '../services/MoveSdk';

const useMoveSdk = () => {
	const [appState, setAppState] = useState(AppState.currentState);
	const [sdkState, setSdkState] = useState<SdkState | null>(null);
	const [tripState, setTripState] = useState<TripState | null>(null);

	// add listeners for sdk state changes and app state changes
	useEffect(() => {
		const appStateListener = AppState.addEventListener('change', (nextAppState) => setAppState(nextAppState));
		const sdkStateListener = MoveSdk.addSdkStateListener((state) => setSdkState(state));
		const tripStateListener = MoveSdk.addTripStateListener((state) => setTripState(state));

		return () => {
			appStateListener.remove();
			sdkStateListener.remove();
			tripStateListener.remove();
		};
	}, []);

	useEffect(() => {
		const checkSdkStatus = async () => {
			const sdkState: SdkState = await MoveSdk.getState();
			const tripState: TripState = await MoveSdk.getTripState();
			const isAuthValid = await MoveSdk.isAuthValid();
			const warnings: ErrorListType = await MoveSdk.getWarnings();
			const errors: ErrorListType = await MoveSdk.getErrors();
			setSdkState(sdkState);
			setTripState(tripState);

			if (!isAuthValid) {
				try {
					await MoveSdk.shutdown(true);
					await AsyncStorage.multiRemove(['userId', 'projectId', 'accessToken', 'refreshToken']);
					await initMoveSdk();
				} catch (err) {
					console.log(err);
				}
			}
		};

		checkSdkStatus();
	}, [appState]);
	return { appState, sdkState, tripState };
};

export default useMoveSdk;
