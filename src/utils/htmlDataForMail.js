const sanitizeHtml = require('sanitize-html');

exports.sendUserRequestMailToSupport = (mailData) => {
 
    const sanitizedUserName = sanitizeHtml(mailData.userName);
    const sanitizedEmail = sanitizeHtml(mailData.email);
    const sanitizedPhoneNumber = sanitizeHtml(mailData.phoneNumber);
    const sanitizedCourse = sanitizeHtml(mailData.course);
    const sanitizedPassOutYear = sanitizeHtml(mailData.passOutYear);
    const sanitizedQualification = sanitizeHtml(mailData.qualification);
    
  
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
      <h1 style="text-align: center; color: #831a46; margin-bottom: 20px;">User Support Request</h1>
      <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 30px;">A user has submitted a support request. Below are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #831a46; color: #ffffff;">
            <th style="text-align: left; padding: 10px; font-size: 14px; border: 1px solid #ddd;">Field</th>
            <th style="text-align: left; padding: 10px; font-size: 14px; border: 1px solid #ddd;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedUserName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedEmail}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Mobile Number</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedPhoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Course</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedCourse}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">PassOut Year</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedPassOutYear}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Qualification</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedQualification}</td>
          </tr>
        </tbody>
      </table>
  
      <p style="font-size: 14px; text-align: center; color: #777; margin-top: 20px;">This is an automated email. Please do not reply directly to this email.</p>
      <p style="font-size: 12px; text-align: center; color: #999;">&copy; ${new Date().getFullYear()} why tap. All rights reserved.</p>
    </div>
    `;
  };

exports.sendChatRequestMailToSupport = (mailData) => {
 
    const sanitizedUserName = sanitizeHtml(mailData.userName);
    const sanitizedEmail = sanitizeHtml(mailData.email);
    const sanitizedPhoneNumber = sanitizeHtml(mailData.phoneNumber);
    const sanitizedCourse = sanitizeHtml(mailData.course);
  
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
      <h1 style="text-align: center; color: #831a46; margin-bottom: 20px;">New Chat Support Request</h1>
      <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 30px;">A user has submitted a chat support request. Below are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #831a46; color: #ffffff;">
            <th style="text-align: left; padding: 10px; font-size: 14px; border: 1px solid #ddd;">Field</th>
            <th style="text-align: left; padding: 10px; font-size: 14px; border: 1px solid #ddd;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedUserName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedEmail}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Mobile Number</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedPhoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Course</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sanitizedCourse}</td>
          </tr>
        </tbody>
      </table>
  
      <p style="font-size: 14px; text-align: center; color: #777; margin-top: 20px;">This is an automated email. Please do not reply directly to this email.</p>
      <p style="font-size: 12px; text-align: center; color: #999;">&copy; ${new Date().getFullYear()} why tap. All rights reserved.</p>
    </div>
    `;
  };
  