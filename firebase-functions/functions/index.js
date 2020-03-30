const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mimeTypes = require('mimetypes');
const mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

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

const OPTIMIZED_MAX_HEIGHT = 1000;
const OPTIMIZED_MAX_WIDTH = 1000;

// Avoid "memory limit exceeded. Function invocation was interrupted."
// https://firebase.google.com/docs/functions/manage-functions#set_timeout_and_memory_allocation
const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
};

admin.initializeApp();

// IMAGE PROCESS
// src https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
// Optimize image and create a thumb
exports.imageProcess = functions.runWith(runtimeOpts).storage.object().onFinalize(async (object) => {

  console.log('object', object);

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

  // Create before in order to have an id for image;
  const newOfferDoc = admin.firestore().collection('offers').doc();
  const newOfferId = newOfferDoc.id;

  // todo, check size, type, set appropriate contentType, find a way to have a unique path (create doc first to get id ?)
  if (data.image) {
    const mimeType = data.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    console.log('mimeType', mimeType);
    const base64EncodedImageString = data.image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = new Buffer(base64EncodedImageString, 'base64');

    const filename = `offers/${newOfferId}.${mimeTypes.detectExtension(mimeType)}`;
    const file = admin.storage().bucket().file(filename);
    await file.save(imageBuffer, { contentType: 'image/jpeg' });
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
