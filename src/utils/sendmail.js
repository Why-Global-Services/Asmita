const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const config = require('../config/config');
const htmlData = require('../utils/htmlDataForMail');
const ApiError = require('../utils/apiError');
require('dotenv').config();

const mailService = async( sendTo, subject, htmlDataForMail) => {
    if(!sendTo){
        return {status: false, message:"Mail id is not provided"}
    }
    if(!htmlData){
        return {status:false, message: "htmlData is not provided"}
    }
    const transporter = nodemailer.createTransport({
        ...config.email.smtp
    });

    const sanitizedEmail = sanitizeHtml(sendTo);

    const mailOption = {
        from: config.email.smtp.auth.user,
        to:sanitizedEmail,
        subject: subject || "Mail for user join chat request",
        html:htmlDataForMail
    }

    const isMailSent = transporter.sendMail(mailOption);
    if (!isMailSent) {
        return {success:false, message: `Unable to sent the ${subject} Email` };
      }
    
      return {success:true, message: "mail sent successfully"};
};

exports.sendUserRequestMailToSupport = async (mailData) => {
    console.log("maildata",mailData);
    const htmlDataForMail = htmlData.sendUserRequestMailToSupport(mailData);
    // const recipients = `${mailData.supportEmail.join(',')}`;
    const recipients = `${mailData.supportEmail}`;
    console.log("recipient",recipients);
    let email = await mailService(
        recipients,
        "Mail for user request",
        htmlDataForMail
    );

    if(!email.success){
        throw new ApiError(500,"Unable to send user request mail. please try again")
      }
  
      return { success: true, message: "send To support team Email successfully"};
}

exports.sendChatRequestMailToSupport = async (mailData) => {
    console.log("maildata",mailData);
    const htmlDataForMail = htmlData.sendChatRequestMailToSupport(mailData);
    // const recipients = `${mailData.supportEmail.join(',')}`;
    const recipients = `${mailData.supportEmail}`;
    console.log("recipient",recipients);
    let email = await mailService(
        recipients,
        "Mail for user chat request",
        htmlDataForMail
    );

    if(!email.success){
        throw new ApiError(500,"Unable to send user chat request mail. please try again")
      }
  
      return { success: true, message: "send To support team Email successfully"};
}