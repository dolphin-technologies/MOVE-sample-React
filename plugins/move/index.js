/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const { withDangerousMod, withPlugins, withAppDelegate, withMainApplication, withProjectBuildGradle } = require('@expo/config-plugins');

function withMoveAppDelegate(config) {
	return withAppDelegate(config, (cfg) => {
		const { modResults } = cfg;
		const { contents } = modResults;
		const lines = contents.split('\n');

		const importIndex = lines.findIndex((line) => /^#import/.test(line));
		const didLaunchIndex = lines.findIndex((line) => /application didFinishLaunchingWithOptions/.test(line));

		modResults.contents = [
			...lines.slice(0, importIndex + 1),
			`#import <ReactMoveSDK/MoveSdk.h>`,

			...lines.slice(importIndex + 1, didLaunchIndex),
			`- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions`,
			`{`,
			`  [RCTMoveSdk initIfPossibleWithLaunchOptions:launchOptions];`,
			`  return YES;`,
			`}`,
			...lines.slice(didLaunchIndex),
		].join('\n');

		return cfg;
	});
}

function withMoveMainApplication(config) {
	return withMainApplication(config, (cfg) => {
		const { modResults } = cfg;
		const { contents } = modResults;
		const lines = contents.split('\n');

		const importIndex = lines.findIndex((line) => /^package/.test(line));

		const mainApplicationIndex = lines.findIndex((line) => /^public class MainApplication extends Application implements ReactApplication {$/.test(line));

		const onCreateIndex = lines.findIndex((line) => /super.onCreate\(\)/.test(line));

		modResults.contents = [
			...lines.slice(0, importIndex + 1),
			`import in.dolph.move.sdk.NativeMoveSdkWrapper;`,
			...lines.slice(importIndex + 1, mainApplicationIndex + 1),
			`	private NativeMoveSdkWrapper sdkWrapper;`,
			...lines.slice(mainApplicationIndex + 1, onCreateIndex + 1),
			`		sdkWrapper = NativeMoveSdkWrapper.getInstance(this);`,
			`		sdkWrapper.init(this);`,
			...lines.slice(onCreateIndex + 1),
		].join('\n');

		return cfg;
	});
}

function withMoveProjectBuildGradle(config) {
	return withProjectBuildGradle(config, (cfg) => {
		const { modResults } = cfg;
		const { contents } = modResults;
		const lines = contents.split('\n');

		const mavenIndex = lines.lastIndexOf('        mavenCentral()');

		modResults.contents = [
			...lines.slice(0, mavenIndex + 1),
			`		maven {`,
			`			url "https://dolphin.jfrog.io/artifactory/move-sdk-libs-release"`,
			`			content {`,
			`				includeGroup "io.dolphin.move"`,
			`			}`,
			`		}`,
			...lines.slice(mavenIndex + 1),
		].join('\n');

		return cfg;
	});
}

function withMove(config) {
	return withPlugins(config, [withMoveAppDelegate, withMoveMainApplication, withMoveProjectBuildGradle]);
}

module.exports = withMove;
