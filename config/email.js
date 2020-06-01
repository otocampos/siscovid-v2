const nodemailer = require('nodemailer');
const senha = require('../senha')
const Email = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass:senha

    }
})

module.exports = Email