import * as firebase from "@firebase/testing";
import {authedApp, createLegalUserDocument, phoneNumber, userDocument, usersCollection,} from "../utils";

describe('Test user security rules',
	() => {
		it('should successfully create user document', async function () {
			await firebase.assertSucceeds(
				createLegalUserDocument()
			);
		});
		it('should fail to create user document without name', async function () {
			await firebase.assertFails(userDocument.set(
				{}
			));
		});
		it('should fail to create illegal user document with wrong phone number', async function () {
			await firebase.assertFails(usersCollection.doc('wrong phone number').set(
				{
					name: 'Itay Levy',
				}
			));
		});
		it('should successfully delete user document', async function () {
			await createLegalUserDocument();
			await firebase.assertSucceeds(
				userDocument.delete()
			);
		});
		it('should successfully read user document', async function () {
			await createLegalUserDocument();
			await firebase.assertSucceeds(
				userDocument.get()
			);
		});
		it('should fail to read user document when user not authenticated', async function () {
			await createLegalUserDocument();
			const unauthenticatedApp = authedApp({uid: 'wrongUid', phone_number: 'wrong phone number'});
			await firebase.assertFails(
				unauthenticatedApp
					.collection('users')
					.doc(phoneNumber)
					.get()
			);
		});
		it('should fail to update other user document name', async function () {
			await createLegalUserDocument();
			const unauthenticatedApp = authedApp({uid: 'barney', phone_number: 'wrong phone number'});
			await firebase.assertFails(
				unauthenticatedApp.collection('users')
					.doc(phoneNumber)
					.set({name: 'barney'})
			)
		});
	}
);