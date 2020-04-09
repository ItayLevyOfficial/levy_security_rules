import * as firebase from "@firebase/testing";
import {
	createLegalSentMessage,
	createLegalUserDocument,
	sentMessages,
	serverTimestamp,
	wrongAuthenticatedSentMessages
} from "../utils";

describe('Test the sent messages collection security rules', () => {
		beforeEach(createLegalUserDocument);
		it('should successfully update a sent message', async function () {
			const sentMessage = await createLegalSentMessage();
			await firebase.assertSucceeds(
				sentMessage.update(
					{
						text: 'Test text 2',
						last_modified_at: serverTimestamp
					}
				)
			);
		});
		it('should fail to update a sent message with wrong modified date', async function () {
			const sentMessage = await createLegalSentMessage();
			await firebase.assertFails(
				sentMessage.update(
					{
						text: 'Test text 2',
						last_modified_at: +new Date()
					}
				)
			);
		});
		it('should fail to update a sent message with too long text', async function () {
			const sentMessage = await createLegalSentMessage();
			await firebase.assertFails(
				sentMessage.update(
					{
						text: 'a'.repeat(501),
						last_modified_at: serverTimestamp
					}
				)
			);
		});
		it('should fail to update a sent message with wrong credentials', async function () {
			const sentMessage = await createLegalSentMessage();
			
			await firebase.assertFails(
				wrongAuthenticatedSentMessages.doc(sentMessage.id).update(
					{
						text: 'Test text 2',
						last_modified_at: serverTimestamp
					}
				)
			);
		});
		it('should successfully read a sent message document', async function () {
			const sentMessage = await createLegalSentMessage();
			await firebase.assertSucceeds(
				sentMessage.get()
			)
		});
		it('should fail to read a sent message document with wrong credentials', async function () {
			const sentMessage = await createLegalSentMessage();
			await firebase.assertFails(
				wrongAuthenticatedSentMessages.doc(sentMessage.id).get()
			)
		});
	}
);
