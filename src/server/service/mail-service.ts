const nodemailer = require("nodemailer");

class MailService {
    transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            secure: false,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: `Activation on account on ${process.env.API_URL}`,
            text: "",
            html: `
                <div>
                    <h1>Click on the link for activation</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new MailService();