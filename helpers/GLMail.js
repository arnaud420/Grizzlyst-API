const nodemailer = require('nodemailer');
const { mail } = require('../config/secret');

class GLMail {

    static createTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail.user,
                pass: mail.pass
            }
        })
    }

    mailTemplate() {
        // code
    }

    static async sendMail(to, subject, content) {
        const transporter = this.createTransport();
        try {
            await transporter.sendMail({
                from: 'no-reply@grizzLyst.com',
                to,
                subject,
                html: content
            });
        }
        catch (e) {
            throw e;
        }

    }
}

module.exports = GLMail;