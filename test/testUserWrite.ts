/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import {phoneNumber, userProfile, projectId, rules, coverageUrl, authedApp, username} from "./utils";

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
	
	@test
	async "legal user document delete"() {
		await userProfile.set(
			{
				phoneNumber: phoneNumber,
				firstName: 'Itay',
				lastName: 'Levy'
			}
		);
		await firebase.assertSucceeds(
			userProfile.delete()
		)
	}
	
	@test
	async "illegal user document delete"() {
		await userProfile.set(
			{
				phoneNumber: phoneNumber,
				firstName: 'Itay',
				lastName: 'Levy'
			}
		);
		const unauthenticatedProfile = authedApp({uid: 'barney'})
			.collection("users")
			.doc(username);
		await firebase.assertFails(
			unauthenticatedProfile.delete()
		)
	}
} 
