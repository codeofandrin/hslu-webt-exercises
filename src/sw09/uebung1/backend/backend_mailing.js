import express from 'express';
import { MongoClient } from "mongodb"

const router = express.Router();

const client = new MongoClient("mongodb://localhost:27018")
const db = client.db("newsletter")
const mailingList = db.collection("mailing_list")

function setResponseAndStatus(res, data, status) {
  res.type('application/json');
  res.status(status);
  res.send(JSON.stringify(data));
}

function validateRegisterRequest(data) {
  if (!('email' in data)) return 'Property "email" is required';
  if (!validateEmail(data.email)) return 'Property "email" must be a valid email address';
  if (!('category' in data)) return 'Property "category" is required';

  const category = Number(data.category);
  if (!Number.isInteger(category)) return 'Property "category" must be an integer value';
  if (category < 0 || category > 3) return 'Property "category" must be in the range [1,3]';

  return null;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post('/register', async function (req, res) {
  try {
    const body = JSON.parse(req.body.toString('utf-8'));
    const error = validateRegisterRequest(body);
    if (error != null) {
      setResponseAndStatus(res, { message: error }, 400);
      return;
    }

    await mailingList.insertOne({ email: body.email, category: Number(body.category) })

    setResponseAndStatus(res, { message: 'email successfully added to category' }, 200);
  } catch (error) {
    setResponseAndStatus(res, { error: 'server error while registering email address' }, 500);
    console.error(error);
  }
});

function validateSendRequest(data) {
  if (!('subject' in data)) return 'Property "subject" is required';
  if (!('text' in data)) return 'Property "text" is required';
  if (!('category' in data)) return 'Property "category" is required';

  if (data.subject == '') return 'Property "subject" must not be empty';
  if (data.text == '') return 'Property "text" must not be empty';

  const category = Number(data.category);
  if (!Number.isInteger(category)) return 'Property "category" must be an integer value';
  if (category < 0 || category > 3) return 'Property "category" must be in the range [1,3]';

  return null;
}

router.post('/send', async function (req, res) {
  try {
    const body = JSON.parse(req.body.toString('utf-8'));
    const error = validateSendRequest(body);
    if (error != null) {
      setResponseAndStatus(res, { error: error }, 400);
      return;
    }

    const category = Number(body.category);
    console.log(`category: ${category}`)
    const emailObjects = await mailingList.find(
      // query
      { category: { $eq: category } },
      // options
      { projection: { _id: 0, email: 1 } }
    ).toArray()

    let emails = [];
    for (let i = 0; i < emailObjects.length; ++i) {
      emails.push(emailObjects[i].email);
      // Optional TODO: send actual emails to the recipients:
      // see function sendMail from invite example shown in lecture
    }

    console.log(emails)

    setResponseAndStatus(res, { sentEmails: emails }, 200);
  } catch (error) {
    setResponseAndStatus(res, { error: 'server error while registering email address' }, 500);
    console.error(error);
  }
});

export default router;