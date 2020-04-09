import * as firebase from "@firebase/testing";
import {createLegalSentMessage, createLegalUserDocument, sentMessages, serverTimestamp} from "../utils";

describe('Test the sent messages collection security rules', () => {
		beforeEach(createLegalUserDocument);
		it('should successfully create a sent message', async function () {
			await firebase.assertSucceeds(
				sentMessages.add(
					{
						text: 'Test text',
						created_at: serverTimestamp
					}
				)
			);
		});
		it('should fail to create a sent message without text', async function () {
			await firebase.assertFails(
				sentMessages.add(
					{
						created_at: serverTimestamp
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
		it('should fail to create a sent message with wrong created_at', async function () {
			await firebase.assertFails(
				sentMessages.add(
					{
						text: 'Test text',
						// This date is wrong because it's the client date, not the server ones.
						created_at: +new Date()
					}
				)
			);
		});
		it('should fail to create a sent message too long text', async function () {
			await firebase.assertFails(
				sentMessages.add(
					{
						text: 'a'.repeat(501),
						created_at: serverTimestamp
					}
				)
			);
		});
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
	}
);
