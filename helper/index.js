const nodeMailer = require("nodemailer");

exports.sendMail = async emailData => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: '574722988350-mq874e515s978fn3nd20foltmmedddh1.apps.googleusercontent.com',
            clientSecret: '3ljuu7qq9cOcXGd9EnQXE8Hy',
            refreshToken: '1/FC3Gaj1Yhi-7u01M79cKX_0t8HN0fcm99LFumSpYwUg',
            accessToken: 'ya29.GlvfBorcUB7Z8oBLswh48oxAMlwDCbGSTfszILdpyzCGlb8Gh-etE-4VjIQrfJKplxmvK9y3tXopvpNIOzInZ2SAyKyWfuraUi5Ab8ff4iVZYK224T0RXMhen2Tv'
        }
    });
    return (
        await transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
}