const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
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

/**
 * Enviar correo a un destinatario con un mensaje en formato de texto.
 * @param {String} recipient Email del destinatario
 * @param {String} msg Mensaje a ser enviado
 */
const sendTextMail = function (recipient, msg) {
    var mailOptions = {
        from: 'innovalab2020@gmail.com',
        to: recipient,
        subject: 'Sending Email using Node.js',
        text: msg
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

const Mailer = {
    sendTextMail
}

module.exports = Mailer;