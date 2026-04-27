export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { email, type } = request.body;

  if (!email) {
    return response.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'RESEND_API_KEY is not set' });
  }

  let subject = '';
  let bodyContent = '';

  if (type === 'waitlist') {
    subject = 'Welcome to the Reservi Waitlist! 🍽️';
    bodyContent = `
      <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">You're on the list!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        We are absolutely thrilled to have you join the Reservi Waitlist.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        Reservi is completely reimagining the way you discover, book, and experience the finest venues. We are launching soon in Casablanca, and you will be the very first to enjoy early access privileges.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 0;">
        Cheers,<br>
        <strong>The Reservi Team</strong>
      </p>
    `;
  } else if (type === 'partner') {
    subject = 'Reservi - Partner Application Received 🤝';
    bodyContent = `
      <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Thank you for your request!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        We have successfully received your application to join the Reservi Restaurant Network.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        Our dedicated business development team is currently reviewing your details. We will reach out to you within 2 business days to proceed with the next steps.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 0;">
        Warmly,<br>
        <strong>The Reservi Team</strong>
      </p>
    `;
  } else if (type === 'contact') {
    subject = 'We received your message! ✉️';
    bodyContent = `
      <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Message Received!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        Thank you for reaching out to us. We have received your message securely.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 20px;">
        Our support coordinators are reviewing your inquiry, and will follow up via this address as promptly as possible.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin-bottom: 0;">
        Best regards,<br>
        <strong>The Reservi Support Team</strong>
      </p>
    `;
  } else {
    return response.status(400).json({ error: 'Invalid type provided' });
  }

  const htmlTemplate = `
    <div style="background-color: #F9FAFB; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6;">
        <div style="background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); padding: 35px 20px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Reservi</h1>
        </div>
        <div style="padding: 40px 30px;">
          ${bodyContent}
          <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 30px 0;" />
          <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">
            © 2026 Reservi. Making dining better.<br>
            admin@reservi-eat.ma
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Reservi <admin@reservi-eat.ma>',
        to: [email],
        subject: subject,
        html: htmlTemplate
      })
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      return response.status(resendRes.status).json({ error: data.message || 'Failed to send email via Resend' });
    }

    return response.status(200).json({ success: true, data });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
