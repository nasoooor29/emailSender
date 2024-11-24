import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Glob } from "bun";
import path from "path";
import { subscribe } from "diagnostics_channel";
import { exit } from "process";

try {
  dotenv.config();
} catch (e) {
  console.log("could not load the creds");
  process.exit(1);
}
const FILE_NAME_CONTAINS = process.env.ATTACHMENT_FILE;
const SUB = process.env.SUBJECT;
const DIR_NAME = process.env.DIR_NAME;
const f = Bun.file("emailBody.txt");
const EMAIL_TEXT = await f.text();
const PASS = process.env.PASS;
const EMAIL = process.env.EMAIL;

console.log(process.env);

interface StudentData {
  name: string;
  acad: string;
  email: string;
  file: string;
}
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

const glob = new Glob("**/*");

const sendEmail = async (stu: StudentData) => {
  const mailOptions = {
    from: EMAIL,
    to: stu.email,
    subject: SUB,
    text: EMAIL_TEXT,
    attachments: [
      {
        filename: `${stu.name} mark.xlsx`, // File name to display in the email
        path: stu.file,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("email sent To:", mailOptions.to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const arr: StudentData[] = [];
for await (const file of glob.scan(DIR_NAME)) {
  if (!file.includes(FILE_NAME_CONTAINS || "")) {
    console.log("skipping file: ", file);
    continue;
  }
  const stuString = file
    .split("/")
    .filter((v, _) => {
      return v.includes("20");
    })
    .sort((a, b) => b.length - a.length);

  if (typeof stuString === undefined || stuString.length === 0) {
    console.log("no students found");
    exit(1);
  }

  const split = stuString[0].split("_");
  if (split.length < 2) {
    console.log("skipping file: ", file);
    continue;
  }
  const stu = <StudentData>{
    acad: split[0],
    name: split[1],
    email: `${split[0]}@student.polytechnic.bh`,
    file: path.join(__dirname, DIR_NAME || "test", file),
  };
  arr.push(stu);
}

arr.forEach((v, _i) => {
  console.log(v);
});

const agree = prompt(
  `this is the emails that would be sent do you agree? ("y" to accept)`,
);
if (!agree?.includes("y")) {
  console.log("bye bye");
  process.exit(1);
}

arr.forEach((stu, _i) => {
  sendEmail(stu);
});

