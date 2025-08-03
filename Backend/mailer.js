const nodemailer = require('nodemailer');

const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS // Tu contraseña de correo electrónico
    }
});

async function enviarCorreoReset(email, token) {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        text: `
            Hola, has solicitado restablecer tu contraseña.
            az clic en el siguiente enlace para cambiarla. Este enlace expirará en 15 minutos:
            ${resetUrl}"
        `
    };

    return trasporter.sendMail(mailOptions)
}

module.exports = {enviarCorreoReset}