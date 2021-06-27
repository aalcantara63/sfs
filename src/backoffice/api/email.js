// const mailer =  require('nodemailer')

// import mailer from 'nodemailer';

// export var mailObj = {

//     serverMailer: 'magftest@gmail.com',

//     sendEmail:  function(email, mess){
        
//         const transporter = mailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'magftest@gmail.com',
//                 pass: 'M@GFtest123'
//             }
//         });

//         const info = transporter.sendMail({
//             from: "Restaurant App Menu",
//             to: email,
//             subject: 'Change status',
//             text: mess,
//         });

//         console.log("Message", info.messageId)
//         console.log("Test" + mess + email);
//     },

// }