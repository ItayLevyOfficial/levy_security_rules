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

@suite
class Levy {
	@test
	async "create a legal user document"() {
		const username = "itaylevy134";
		const phoneNumber = '+972544677';
		const db = authedApp({uid: username, phone_number: phoneNumber});
		const userProfile = db.collection("users").doc(username);
		await firebase.assertSucceeds(userProfile.set(
			{
				phoneNumber: phoneNumber,
				firstName: 'Itay',
				lastName: 'Levy'
			}
		));
	}
} 
