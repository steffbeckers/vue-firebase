import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

// Firestore
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// API with Express
const app = express();
const main = express();
const firebaseHelper = require("firebase-functions-helper");
const contactsCollection = "contacts";

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

// Contacts

// Add new contact
app.post("/contacts", (req, res) => {
  firebaseHelper.firestore.createNewDocument(db, contactsCollection, req.body);
  res.send("Create a new contact");
});

// Update new contact
app.patch("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore.updateDocument(
    db,
    contactsCollection,
    req.params.contactId,
    req.body
  );
  res.send("Update a new contact");
});

// View a contact
app.get("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, contactsCollection, req.params.contactId)
    .then((doc: any) => res.status(200).send(doc));
});

// View all contacts
app.get("/contacts", (req, res) => {
  firebaseHelper.firestore
    .backup(db, contactsCollection)
    .then((data: any) => res.status(200).send(data));
});

// Delete a contact
app.delete("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore.deleteDocument(
    db,
    contactsCollection,
    req.params.contactId
  );
  res.send("Document deleted");
});

// Important: If you are using HTTP functions to serve dynamic content for Firebase Hosting, you must use us-central1.
// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// https://github.com/firebase/firebase-tools/issues/842

// NOT SUPPORTED ATM.....
// export const webApi = functions.region("europe-west1").https.onRequest(main);
// SO:
export const webApi = functions.region("us-central1").https.onRequest(main);
