const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mimeTypes = require('mimetypes');
const mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const isBase64 = require('is-base64');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// error list
// https://firebase.google.com/docs/reference/functions/providers_https_#functions-error-code


// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 400;
const THUMB_MAX_WIDTH = 400;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb-';

// Max height and width for image
const OPTIMIZED_MAX_HEIGHT = 1000;
const OPTIMIZED_MAX_WIDTH = 1000;

// Avoid "memory limit exceeded. Function invocation was interrupted."
// https://firebase.google.com/docs/functions/manage-functions#set_timeout_and_memory_allocation
const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
};

const IMAGE_EXTENSIONS = [
  'image/png',
  'image/jpg',
  'image/jpeg'
];

admin.initializeApp();

// IMAGE PROCESS
// src https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
// Optimize image and create a thumb
exports.imageProcess = functions.runWith(runtimeOpts).storage.object().onFinalize(async (object) => {

  console.log('checking object', object);

  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  // we want to process only images in offers folder
  if (!filePath.startsWith('offers/')) {
    return console.log('We are not in offers folder');
  }

  // Metadata to avoid loop process
  if (object.metadata && object.metadata.processedByCloudFunction) {
    return console.log('Image already processed');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    processedByCloudFunction: true,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await file.download({destination: tempLocalFile});
  console.log('The file has been downloaded to', tempLocalFile);


  // Optimize image using ImageMagick.
  await spawn('convert', [tempLocalFile, '-resize', `${OPTIMIZED_MAX_WIDTH}x${OPTIMIZED_MAX_HEIGHT}>`, tempLocalFile], {capture: ['stdout', 'stderr']});
  console.log('resized at', tempLocalFile);
  await spawn('convert', [tempLocalFile, '-strip', `-interlace`, 'Plane', '-quality', '90', tempLocalFile], {capture: ['stdout', 'stderr']});
  console.log('optimized at', tempLocalFile);

  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  console.log('Thumbnail created at', tempLocalThumbFile);

  // Uploading both.
  await bucket.upload(tempLocalFile, {destination: filePath, metadata: {metadata: metadata}});
  console.log('Optimized uploaded to Storage at', filePath);

  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: {metadata: metadata}});
  console.log('Thumbnail uploaded to Storage at', thumbFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);

  // Get the Signed URLs for the thumbnail and original image.
  // Not very clear to me, it saves path to realtime database
  const config = {
    action: 'read',
    expires: '03-01-2500',
  };
  const results = await Promise.all([
    thumbFile.getSignedUrl(config),
    file.getSignedUrl(config),
  ]);
  console.log('Got Signed URLs.');
  // const thumbResult = results[0];
  // const originalResult = results[1];
  // const thumbFileUrl = thumbResult[0];
  // const fileUrl = originalResult[0];

  // store refs to appropriate doc (as the filename is the id)
  const docId = path.parse(fileName).name;
  return admin.firestore().collection('offers').doc(docId)
    .update({
      imageUrl: results[1],
      thumbUrl: results[0],
    }).then((res) => {
      return console.log('Doc references to images have been updated ', res);
    }).catch((error) => {
      return console.log("Error getting document :", error);
    });


  // Add the URLs to the Database
  // await admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  // return console.log('Thumbnail URLs saved to database.');
});



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
      'L\'utilisateur existe déjà.');
  }

  const publicProfile = await admin.firestore().collection('publicProfiles').doc(data.username).get();
  if (publicProfile.exists) {
    throw new functions.https.HttpsError('already-exists',
      'Ce nom d\'utilisateur est déjà pris.');
  }

  //const user = await admin.auth().getUser(context.auth.uid);
  // todo If it's an admin, we provide claims
  // if (user.email === functions.config().accounts.admin) {
  //   await admin.auth().setCustomUserClaims(context.auth.uid, {admin: true});
  // }

  const newDate = new Date();

  return new Promise((resolve, reject) => {
    admin.firestore().collection('publicProfiles').doc(data.username).set({
      userId: context.auth.uid,
      dateCreated: newDate,
      dateUpdated: newDate,
      offersNumber: 0,
    }).then((result) => {
      return resolve(result);
    }).catch(reject)
  });

});

// POST OFFER
exports.postOffer = functions.https.onCall(async (data, context) => {
  checkAuthentication(context);

  console.log('data', data);

  const validKeys = {
    title: 'string',
    description: 'string',
  };

  if (data.image) {
    validKeys.image = 'string';
  }

  dataValidator(data, validKeys);

  const user = await admin.firestore().collection('publicProfiles')
    .where('userId', '==', context.auth.uid)
    .limit(1)
    .get();

  if (user.empty) {
    throw new functions.https.HttpsError('not-found',
      'L\'utilisateur n\'a pas pu être trouvé.');
  }

  const newDate = new Date();

  const newOffer = {
    author: user.docs[0].ref,
    title: data.title,
    description: data.description,
    dateCreated: newDate,
    dateUpdated: newDate,
  };

  // Create before in order to have an id for image;
  const newOfferDoc = admin.firestore().collection('offers').doc();
  const newOfferId = newOfferDoc.id;

  if (data.image) {

    // Is there a problem ? sometimes create an issue
    // todo replace it ?
    // Unhandled error RangeError: Maximum call stack size exceeded
    //     at RegExp.test (<anonymous>)
    //     at isBase64 (/srv/node_modules/is-base64/is-base64.js:30:50)

    // if (!isBase64(data.image, {mimeRequired: true})) {
    //   throw new functions.https.HttpsError('invalid-argument',
    //     'L\'image est invalide. Le format base64 est incorrect.');
    // }

    const mimeType = data.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    console.log('mimeType', mimeType);

    if (!IMAGE_EXTENSIONS.includes(mimeType)) {
      throw new functions.https.HttpsError('invalid-argument',
        'L\'image est invalide. L\'extension n\'est pas autorisée.');
    }

    const base64EncodedImageString = data.image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = new Buffer(base64EncodedImageString, 'base64');

    const filename = `offers/${newOfferId}.${mimeTypes.detectExtension(mimeType)}`;
    const file = admin.storage().bucket().file(filename);
    await file.save(imageBuffer, { contentType: mimeType });
    const fileUrl = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' }).then(urls => urls[0]);
    newOffer.imageUrl = fileUrl;
  }

  return new Promise((resolve, reject) => {
    newOfferDoc.set(newOffer)
      .then((result) => {
      return resolve(newOfferId);
    }).catch(reject)
  });

});


// INCREMENT USER OFFERS NUMBER
// This is an effect of post offer
exports.incrementUserOffers = functions.firestore.document('offers/{offerId}')
  .onCreate(async (snap, context) => {
    const newOffer = snap.data();
    console.log('New offer has been created : ', newOffer);

    console.log('We want to increment offersNumber for the user : ', newOffer.author.id);
    console.log('Trying to get the user');

    // Author is a reference : https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
    const user = await admin.firestore().collection('publicProfiles').doc(newOffer.author.id);
    console.log('user', user);

    if (user.empty) {
      throw new functions.https.HttpsError('not-found',
        'L\'utilisateur n\'a pas pu être trouvé.');
    }

    const userData = await user.get().then(doc => doc.data());
    console.log('userData', userData);
    let previousOffersNumber = userData.offersNumber;
    console.log('Previous OffersNumber', previousOffersNumber);
    const newValue = previousOffersNumber + 1;

    return new Promise((resolve, reject) => {
      user.update({
        offersNumber: newValue,
      }).then((res) => {
        console.log('Offers number as been incremented to ', newValue);
        return resolve(res);
      }).catch(reject)
    });
  });



// -----------------------------
// UTILS
// -----------------------------

function dataValidator(data, validKeys) {
  if (Object.keys(data).length !== Object.keys(validKeys).length) {
    throw new functions.https.HttpsError('invalid-argument',
      'Le nombre de propriétés est invalide.');
  } else {
    for (let key in data) {
      if (!validKeys[key] || typeof data[key] !== validKeys[key]) {
        throw new functions.https.HttpsError('invalid-argument',
          `La propriété "${key}" est invalide.`);
      }
    }
  }
}

function checkAuthentication(context, adminRequired) {
  if(!context.auth){
    throw new functions.https.HttpsError('unauthenticated',
      'Vous devez être authentifié pour accéder à cette fonctionnalité.');
  } else if (adminRequired && !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied',
      'Vous devez être admin pour accéder à cette fonctionnalité.');
  }
}
