const nodeFcm = require("fcm-node");
const admin = require("firebase-admin");
const Notification = require("../../models/Notification");

// fcm-node
const fcm = new nodeFcm(process.env.SERVER_KEY);

// admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const subscribeToTopic = async ({ token, topicName }) => {
  try {
    await admin.messaging().subscribeToTopic(token, topicName);
    console.log(
      `Device ${token} subscribed to topic ${topicName} successfully`
    );
    return true;
  } catch (error) {
    throw error;
  }
};

const sentMessageToSpecificUser = async ({ tokens, title, body }) => {
  const message = {
    registration_ids: tokens,
    notification: {
      title,
      body,
    },
  };

  fcm.send(message, async function (err, response) {
    if (err) {
      return false;
    } else {
      const notification = new Notification({
        title,
        body,
        userId: topic,
      });

      await notification.save();

      return true;
    }
  });
};

const sentMessageToTopic = async ({ topic, title, body }) => {
  const message = {
    registration_ids: `/topics/${topic}`,
    notification: {
      title,
      body,
    },
  };

  fcm.send(message, async function (err, response) {
    if (err) {
      console.log(err);
      return false;
    } else {
      const notification = new Notification({
        title,
        body,
        userId: topic,
      });

      await notification.save();
      return true;
    }
  });
};

module.exports = {
  subscribeToTopic,
  sentMessageToSpecificUser,
  sentMessageToTopic,
};
