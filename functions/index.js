const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });

const SENDGRID_API_KEY = functions.config().sendgrid.key


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


exports.httpEmail = functions.https.onRequest((req, res) => {

    cors( req, res, () => { 

        const toName  = req.body.toName;
        const toEmail = req.body.toEmail;

        const msg = {
            to: toEmail,
            from: 'hello@angularfirebase.com',
            subject:  'New Follower',
            // text: `Hey ${toName}. You have a new follower!!! `,
            // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

            // custom templates
            templateId: '300e1045-5b30-4f15-8c43-41754b73fe4f',
            substitutionWrappers: ['{{', '}}'],
            substitutions: {
              name: toName
              // and other custom properties here
            }
        };

        return sgMail.send(msg)
                
            .then(() => res.status(200).send('email sent!') )
            .catch(err => res.status(400).send(err) )

        });

});



exports.firestoreEmail = functions.firestore
    .document('users/{userId}/followers/{followerId}')
    .onCreate(event => {

        const userId = event.params.userId;

        const db = admin.firestore()

        return db.collection('users').doc(userId)
                 .get()
                 .then(doc => {

                    const user = doc.data()

                    const msg = {
                        to: user.email,
                        from: 'hello@angularfirebase.com',
                        subject:  'New Follower',
                        // text: `Hey ${toName}. You have a new follower!!! `,
                        // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
                        // custom templates
                        templateId: '300e1045-5b30-4f15-8c43-41754b73fe4f',
                        substitutionWrappers: ['{{', '}}'],
                        substitutions: {
                          name: user.displayName
                          // and other custom properties here
                        }
                    };

                    return sgMail.send(msg)
                })
                .then(() => console.log('email sent!') )
                .catch(err => console.log(err) )
                     

});

