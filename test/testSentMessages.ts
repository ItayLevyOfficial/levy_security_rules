/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />

import * as firebase from "@firebase/testing";
import {coverageUrl, db, projectId, rules, userID} from "./utils";

// @suite
// class TestSentMessagesSecurityRules {
// 	@test
// 	async "create legal sent message"(){
// 		firebase.assertSucceeds(
// 			db.collection("users")
// 				.doc(userID)
// 				.collection('sentMessages')
// 				.add()
// 		)
// 	}
// }