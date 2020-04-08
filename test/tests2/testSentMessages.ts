import * as firebase from "@firebase/testing";
import {createLegalUserDocument, sentMessages, userDocument} from "../utils";

describe('Test the sent messages collection security rules', () => {
		beforeEach(createLegalUserDocument);
		it('should successfully create a sent message', async function () {
			await firebase.assertSucceeds(
				sentMessages.add(
					{
						text: 'Test text',
						created_at: firebase.firestore.FieldValue.serverTimestamp()
					}
				)
			);
		});
		it('should fail to create a sent message without text', async function () {
			await firebase.assertFails(
				sentMessages.add(
					{
						created_at: firebase.database.ServerValue.TIMESTAMP
					}
				)
			);
		});
		it('should fail to create a sent message without created_at', async function () {
			await firebase.assertFails(
				sentMessages.add(
					{
						text: 'Test text'
					}
				)
			);
		});
	}
);
