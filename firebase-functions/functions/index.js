const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mimeTypes = require('mimetypes');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// error list
// https://firebase.google.com/docs/reference/functions/providers_https_#functions-error-code

admin.initializeApp();

// CREATE PUBLIC PROFILE

// At this point, a user has already been created in front, now we create an entry for it in publicProfiles collection
exports.createPublicProfile = functions.https.onCall(async (data, context) => {
  checkAuthentication(context);
  dataValidator(data, {
    username: 'string'
  });

  const userProfile = await admin.firestore().collection('publicProfiles')
    .where('userId', '==', context.auth.uid).limit(1).get();

  if (!userProfile.empty){
    throw new functions.https.HttpsError('already-exists',
      'This user already has a public profile.');
  }

  const publicProfile = await admin.firestore().collection('publicProfiles').doc(data.username).get();
  if (publicProfile.exists) {
    throw new functions.https.HttpsError('already-exists',
      'This username already belongs to an existing user.');
  }

  //const user = await admin.auth().getUser(context.auth.uid);
  // todo If it's an admin, we provide claims
  // if (user.email === functions.config().accounts.admin) {
  //   await admin.auth().setCustomUserClaims(context.auth.uid, {admin: true});
  // }

  return new Promise((resolve, reject) => {
    admin.firestore().collection('publicProfiles').doc(data.username).set({
      userId: context.auth.uid
    }).then((result) => {
      return resolve(result);
    }).catch(reject)
  });

});

// POST OFFER
exports.postOffer = functions.https.onCall(async (data, context) => {
  checkAuthentication(context);


  // todo: add data validator with optional properties
  // dataValidator(data, {
  //   title: 'string',
  //   description: 'string',
  // });

  const user = await admin.firestore().collection('publicProfiles')
    .where('userId', '==', context.auth.uid)
    .limit(1)
    .get();

  if (user.empty) {
    throw new functions.https.HttpsError('not-found',
      'User could not be found');
  }

  const newOffer = {
    author: user.docs[0].ref,
    title: data.title,
    description: data.description,
  };

  // todo, check size, type, set appropriate contentType, find a way to have a unique path (create doc first to get id ?)
  if (data.image) {
    const mimeType = data.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    const base64EncodedImageString = data.image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = new Buffer(base64EncodedImageString, 'base64');

    const filename = `offers/${data.title}.${mimeTypes.detectExtension(mimeType)}`;
    const file = admin.storage().bucket().file(filename);
    await file.save(imageBuffer, { contentType: 'image/jpeg' });
    const fileUrl = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' }).then(urls => urls[0]);
    newOffer.imageUrl = fileUrl;
  }

  return new Promise((resolve, reject) => {
    admin.firestore().collection('offers').add(newOffer)
      .then((result) => {
      return resolve(result.id);
    }).catch(reject)
  });

});


// -----------------------------
// UTILS
// -----------------------------

function dataValidator(data, validKeys) {
  if (Object.keys(data).length !== Object.keys(validKeys).length) {
    throw new functions.https.HttpsError('invalid-argument',
      'Data object contains invalid number of properties');
  } else {
    for (let key in data) {
      if (!validKeys[key] || typeof data[key] !== validKeys[key]) {
        throw new functions.https.HttpsError('invalid-argument',
          'Data object contains invalid properties');
      }
    }
  }
}

function checkAuthentication(context, adminRequired) {
  if(!context.auth){
    throw new functions.https.HttpsError('unauthenticated',
      'You must be signed in to use this feature');
  } else if (adminRequired && !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied',
      'You must be an admin to use this feature');
  }
}
