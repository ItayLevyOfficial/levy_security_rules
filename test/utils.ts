import * as fs from "fs";
import * as firebase from "@firebase/testing";

export const projectId = "levy";
export const coverageUrl = `http=//localhost=8080/emulator/v1/projects/${projectId}=ruleCoverage.html`;
export const rules = fs.readFileSync("firestore.rules", "utf8");
export const phoneNumber = '+972544677';
export const usersCollection = authedApp({uid: 'itaylevy134', phone_number: phoneNumber})
	.collection("users");
export const userDocument = usersCollection.doc(phoneNumber);
export const unauthenticatedApp = authedApp({uid: 'wrongUid', phone_number: 'wrong phone number'});
export const sentMessages = userDocument.collection('sent_messages');
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export function authedApp(auth) {
	return firebase.initializeTestApp({projectId, auth}).firestore();
}

export async function createLegalUserDocument() {
	await userDocument.set(
		{
			name: 'Itay Levy'
		}
	);
}

export async function createLegalSentMessage() {
	return await sentMessages.add(
		{
			text: 'Test text',
			created_at: firebase.firestore.FieldValue.serverTimestamp()
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

