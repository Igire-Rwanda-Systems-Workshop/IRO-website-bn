// Dummy email sending function
exports.sendEmail = (email, subject, message) => {
    console.log(`Sending email to ${email}: ${subject} - ${message}`);
    // Here, you'd integrate an actual email sending service (e.g., SendGrid, Nodemailer)
};
