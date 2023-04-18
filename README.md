# Dolphin MOVE SDK Sample App

The MOVE SDK enables you to collect location data, motion information and other sensor data from your users' smartphones. This data is then transmitted to our backend, where it is evaluated, enriched with industry leading machine learning algorithms and applied to a comprehensive 24/7 timeline. Reference: MOVE SDK React Native Integration [documentation](https://docs.movesdk.com/move-platform/sdk/getting-started/react-native).

This is a sample application that uses the Dolphin MOVE SDK. The main purpose of this application is to demonstrate the integration process with MOVE SDK. The application is kept as simple as possible.

The application is created using [Expo](https://docs.expo.dev/). Because of that, plugin should be used for integration with MOVE SDK `./plugins/move/index.js`.

## App cycle goes as follows:

On the first app start, the app will create a user with a random _userId_ and will try to init MOVE SDK and add all necessary listeners. The app will save the user's data to the AsyncStorage and try to use it for subsequent runs of the app until the _refreshToken_ for SDK expires (one week). In this case, a new user will be created and new init MOVE SDK will be executed.

#### Toggle Activation switch: ON

- If required permissions were:
  - granted: SDK will be in ready state and will automatically start SDK services using [`startAutomaticDetection`](https://docs.movesdk.com/move-platform/sdk/api-interface/react-native/services#start-automatic-detection) API.
  - denied: SDK will be in an error state waiting for the errors to be resolved, Alert modal will be shown requesting required permissions.

#### Toggle Activation switch: OFF

- Stops the SDK services using [`stopAutomaticDetection`](https://docs.movesdk.com/move-platform/sdk/api-interface/react-native/services#stop-automatic-detection) API.
- As the sample app is using the `stopAutomaticDetection` API and not `shutdown`, the SDK state will only transit to ready state and not shutdown. Hence, future on toggles will only start SDK services without re-creating a user or re-initializing the SDK.

#### Press SHUTDOWN Button

- Execute MOVE SDK [`shutdown`](https://docs.movesdk.com/move-platform/sdk/api-interface/react-native/services#shutdown-sdk) function. SDK gets status `uninitialized`. To init SDK again - kill the app and open it again.

## To run this project:

1. Run `yarn` to install all modules.
2. Run `yarn prebuild` to create ios and android directories.
3. Run `yarn android`/`yarn ios` to create a build.

## Starting Point:

### SDK Setup:

#### Authorization

1. In order to integrate the application with SDK, you need to register on the [MOVE SDK Dashboard](https://dashboard.movesdk.com/) website.
2. Create a new project.
3. Go to _Configuration_ -> _MANAGE API KEYS_ and create a new **_Write Only_** API key and copy it.
4. Go back to sample app and paste your API key in **app.json** `expo.extra.token`.
5. Create a new sample app build.
6. Thats' it! You're ready to go!

The sample app is using your API key to register new user and fetch a [MoveSdkAuth](https://docs.movesdk.com/move-platform/sdk/models/moveauth#react-native) from the MOVE Server. That data is necessary to setup MOVE SDK. If the provided MoveSdkAuth was invalid, the SDK will not initialize and will provide list of errors/warnings via `MoveSdk.getErrors()`/`MoveSdk.getWarnings()` or via listeners.

For more auth info check [MOVE SDK initialization](https://docs.movesdk.com/move-platform/sdk/api-interface/react-native/initialization).

#### Configuration

[MoveSdkConfig](https://docs.movesdk.com/move-platform/sdk/models/moveconfig) allows host apps to configure which of the licensed MOVE features should be enabled. Note: you cannot activate more features in the MOVE SDK frontend, than you configured in the [MOVE Dashboard Configuration tab](https://dashboard.movesdk.com/admin/sdkConfig). All permissions required for the requested configurations must be granted.

#### Listeners

The host app is expected to set [listeners](https://docs.movesdk.com/move-platform/sdk/models/untitled) to subscribe and listen for changes in SDK state, trips state, auth state, errors and warnings.

#### Testing MOVE SDK

1. Provide all necessary permissions and **Toggle Activation switch: ON**.
2. Make a trip (e.g. use your car, bike, walking, public transport, etc) with this app running in the background. Ideally you use the app for half a day or longer on your private phone in the real world. Any attempts to simulate "real-world" behavior in the office may fail, as MOVE combines GPS, sensor and OS data to validate your mobility behavior.
3. Go back to the [MOVE SDK Dashboard](https://dashboard.movesdk.com/) website -> _Timeline_ and enter your _userId_ (you can find it in the app below the _Recording Switch button_).

## Next steps

This app is merely the minimal setup to initialise MOVE on your device using your own MOVE project. You may want to

1. Fetch the results of your testing from the [MOVE API](https://docs.movesdk.com/move-platform/backend/getting-started-with-the-dolphin-move-timeline-service) and display the user timeline in your preferred enviornment (e.g. web page, app).
2. continue on other projects in the [MOVE github](https://github.com/dolphin-technologies). For example the MOVE App is more complex and offers user interfaces for visualising the MOVE timeline.
3. authentication using the API-key in the app is actually discouraged. Rather, we encourage you to request user tokens from the MOVE backend via your own backend. You can find sample code about this in github (both, Backend and Frontend code).

## Support

Contact info@dolph.in

## License

The contents of this repository are licensed under the
[Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
