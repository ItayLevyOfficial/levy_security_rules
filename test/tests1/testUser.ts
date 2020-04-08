import * as firebase from "@firebase/testing";
import {
	authedApp,
	createLegalUserDocument,
	phoneNumber,
	usersCollection,
} from "../utils";

describe('Test user security rules',
	() => {
		it('should successfully create user document', async function () {
			await firebase.assertSucceeds(
				createLegalUserDocument()
			);
		});
		it('should fail to create user document without name', async function () {
			await firebase.assertFails(usersCollection.add(
				{
					phoneNumber: phoneNumber
				}
			));
		});
		it('should fail to create illegal user document with wrong phone number', async function () {
			await firebase.assertFails(usersCollection.add(
				{
					phoneNumber: '12345',
					name: 'Itay Levy',
				}
			));
		});
		it('should successfully delete user document', async function () {
			const createdDocument = await createLegalUserDocument();
			await firebase.assertSucceeds(
				createdDocument.delete()
			);
		});
		it('should successfully read user document', async function () {
			const createdDocument = await createLegalUserDocument();
			await firebase.assertSucceeds(
				createdDocument.get()
			);
		});
		it('should fail to read user document when user not authenticated', async function () {
			await createLegalUserDocument();
			const unauthenticatedApp = authedApp({uid: 'wrongUid', phone_number: 'wrong phone number'});
			await firebase.assertFails(
				unauthenticatedApp
					.collection('users')
					.where('phone_number', '==', phoneNumber)
					.get()
			);
		});
		it('should fail to update other user document phone_number to ' +
			'authenticated phone_number', async function () {
			const createdDocument = await createLegalUserDocument();
			const wrongPhoneNumber = 'wrong phone number';
			const unauthenticatedApp = authedApp({uid: 'barney', phone_number: wrongPhoneNumber});
			await firebase.assertFails(
				unauthenticatedApp.collection('users')
					.doc(createdDocument.id)
					.set({phone_number: wrongPhoneNumber}, {merge: true})
			)
		});
	}
);