/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import {
	createLegalUserDocument, db,
	phoneNumber,
	userProfile, usersCollection,
} from "./utils";


@suite
class TestUserSecurityRules {
	@test
	async "create legal user document"() {
		await firebase.assertSucceeds(
			createLegalUserDocument()
		);
	}
	
	@test
	async "create illegal user document (without name)"() {
		await firebase.assertFails(usersCollection.add(
			{
				phoneNumber: phoneNumber
			}
		));
	}
	
	@test
	async "create illegal user document (wrong phone number)"() {
		await firebase.assertFails(usersCollection.add(
			{
				phoneNumber: '12345',
				name: 'Itay Levy',
			}
		));
	}
	
	@test
	async "legal user document delete"() {
		const createdDocument = await createLegalUserDocument();
		// const query_snapshot = await db.collection('users')
		// 	.where('phone_number', '==', phoneNumber).get();
		await firebase.assertSucceeds(
			createdDocument.delete()
		);
	}
	
	// @test
	// async "illegal user document delete"() {
	// 	const createdDocument = await createLegalUserDocument();
	// 	db.app.auth().signOut();
	// 	await firebase.assertFails(
	// 		createdDocument.delete()
	// 	);
	// }
	
	@test
	async "legal user document read"() {
		const createdDocument = await createLegalUserDocument();
		await firebase.assertSucceeds(
			createdDocument.get()
		);
	}
	
	// @test
	// async "illegal user document read (not the document of the authenticated user)"() {
	// 	await createLegalUserDocument();
	//
	// 	await firebase.assertFails(
	// 		wrongAuthenticatedProfile.get()
	// 	);
	// }
}
