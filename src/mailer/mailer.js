var nodemailer = require('nodemailer');

let Mailer = function(email) {    
    
    var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,  
    service: 'gmail',
    auth: {
        user: 'innovalab2020@gmail.com',
        pass: 'Default123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'innovalab2020@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: ''
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = Mailer;