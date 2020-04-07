import * as fs from "fs";
import * as firebase from "@firebase/testing";


export const projectId = "levy";
export const coverageUrl = `http=//localhost=8080/emulator/v1/projects/${projectId}=ruleCoverage.html`;
export const rules = fs.readFileSync("firestore.rules", "utf8");
export const username = "itaylevy134";
export const phoneNumber = '+972544677';
export const db = authedApp({uid: username, phone_number: phoneNumber});
export const userProfile = db.collection("users").doc(username);
export const wrongAuthenticatedProfile = authedApp({uid: 'barney'})
	.collection("users")
	.doc(username);

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
export function authedApp(auth) {
	return firebase.initializeTestApp({projectId, auth}).firestore();
}

export async function createLegalUserDocument() {
	await userProfile.set(
		{
			phoneNumber: phoneNumber,
			firstName: 'Itay',
			lastName: 'Levy'
		}
	);
}

before(async () => {
	await firebase.loadFirestoreRules({projectId, rules});
});

beforeEach(async () => {
	await firebase.clearFirestoreData({projectId});
});

after(async () => {
	await Promise.all(firebase.apps().map(app => app.delete()));
	console.log(`View rule coverage information at ${coverageUrl}\n`);
});