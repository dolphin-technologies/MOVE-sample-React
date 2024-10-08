import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import MoveSdk, { AuthState, AuthStateEvent, ErrorListType, SdkState, TripState, WarningListType } from 'react-native-move-sdk';
import { initMoveSdkWithCode } from '../services/MoveSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
			const warnings: WarningListType = await MoveSdk.getWarnings();
			const errors: ErrorListType = await MoveSdk.getErrors();
			setSdkState(sdkState);
			setTripState(tripState);

			if (!isAuthValid && sdkState !== MoveSdk.UNINITIALIZED) {
				try {
					await MoveSdk.shutdown(true);
					await AsyncStorage.multiRemove(['userId']);
					await initMoveSdkWithCode();
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
