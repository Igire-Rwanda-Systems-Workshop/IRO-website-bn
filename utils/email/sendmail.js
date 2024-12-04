import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: `${process.env.USER_EMAIL}`,
      pass: `${process.env.APP_PASSWORD}`,
    },
  });
  
  async function main(email, password, text, to) {
    const info = await transporter.sendMail({
      from: '"Leave Request" <no-reply@gmail.com>', 
      to: `${to}`, // list of receivers
      subject: "Leave Request Information✔",  
      html: `<body>
       ${text}</br>
      <b>${email === "undefined" ? "": email }</b> <br /><b>${password}</b></br> 
      <body>`,
    });
  
  }

  
 

  export default main
  