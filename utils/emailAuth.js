sendPasswordSetupEmail: async (email, setupLink) => {
  await transporter.sendMail({
    from: 'your-system@example.com',
    to: email,
    subject: 'Set Up Your Account Password',
    html: `
      <h1>Account Creation</h1>
      <p>Your account has been created. Please set up your password by clicking the link below:</p>
      <a href="${setupLink}">Set Up Password</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
}