import * as firebase from "@firebase/testing";
import {authenticatedDb, createLegalUserDocument, usersCollection} from "../utils";

describe('Test the sent messages collection security rules', () => {
		it('should successfully create a sent message', async function () {
			const userDoc = await createLegalUserDocument();
			await firebase.assertSucceeds(
				userDoc
					.collection('sent_messages')
					.add({
						text: 'Test text',
						created_at: firebase.database.ServerValue.TIMESTAMP
					})
			);
		});
	}
);
