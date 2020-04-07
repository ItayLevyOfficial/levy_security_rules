/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import {
	createLegalUserDocument,
	phoneNumber,
	userProfile,
	wrongAuthenticatedProfile
} from "./utils";


@suite
class TestUserSecurityRules {
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
		await createLegalUserDocument();
		await firebase.assertFails(
			wrongAuthenticatedProfile.delete()
		);
	}
	
	@test
	async "legal user document read"() {
		await createLegalUserDocument();
		await firebase.assertSucceeds(
			userProfile.get()
		);
	}
	
	@test
	async "illegal user document read (not the document of the authenticated user)"() {
		await createLegalUserDocument();
		
		await firebase.assertFails(
			wrongAuthenticatedProfile.get()
		);
	}
}
