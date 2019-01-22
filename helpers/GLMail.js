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

    static sendMail(to, subject, content) {
        const transporter = this.createTransport();
        return transporter.sendMail({
            from: 'no-reply@grizzLyst.com',
            to,
            subject,
            html: content
        });
    }

    static sendMultipleInvitations(emails, group) {
        let promises = [];
        const subject = `Demande d'inscription au groupe ${group.name}`;
        const content = 'Invitation à télécharger l\'application GrizzLyst';

        for (let i = 0; i < emails.length; i++) {
            promises.push(this.sendMail(emails[i], subject, content));
        }

        return Promise.all(promises);
    }
}

module.exports = GLMail;