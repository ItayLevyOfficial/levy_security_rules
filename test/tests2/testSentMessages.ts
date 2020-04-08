import * as firebase from "@firebase/testing";
import {createLegalUserDocument, userDocument} from "../utils";

describe('Test the sent messages collection security rules', () => {
		it('should successfully create a sent message', async function () {
			await createLegalUserDocument();
			await firebase.assertSucceeds(
				userDocument.collection('sent_messages').add(
					{
						text: 'Test text',
						created_at: firebase.database.ServerValue.TIMESTAMP
					}
				)
			);
		});
	}
);
