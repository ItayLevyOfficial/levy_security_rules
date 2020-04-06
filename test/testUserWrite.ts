/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import * as fs from "fs";

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "levy";
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
	return firebase.initializeTestApp({projectId, auth}).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async () => {
	await firebase.loadFirestoreRules({projectId, rules});
});

beforeEach(async () => {
	// Clear the database between tests
	await firebase.clearFirestoreData({projectId});
});

after(async () => {
	await Promise.all(firebase.apps().map(app => app.delete()));
	console.log(`View rule coverage information at ${coverageUrl}\n`);
});
const username = "itaylevy134";
const phoneNumber = '+972544677';
const db = authedApp({uid: username, phone_number: phoneNumber});
const userProfile = db.collection("users").doc(username);

@suite
class TestUserWrite {
	@test
	async "create legal user document"() {
		await firebase.assertSucceeds(userProfile.set(
			{
				phoneNumber: phoneNumber,
				firstName: 'Itay',
				lastName: 'Levy'
			}
		));
	}
	
	@test
	async "create illegal user document (without first name)"() {
		await firebase.assertFails(userProfile.set(
			{
				phoneNumber: phoneNumber,
				lastName: 'Levy'
			}
		));
	}
	
	@test
	async "create illegal user document (without last name)"() {
		await firebase.assertFails(userProfile.set(
			{
				phoneNumber: phoneNumber,
				firstName: 'Itay'
			}
		));
	}
	
	@test
	async "create illegal user document (wrong phone number)"() {
		await firebase.assertFails(userProfile.set(
			{
				phoneNumber: '12345',
				firstName: 'Itay',
				lastName: 'Levy'
			}
		));
	}
} 
