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
    subject = 'Reservi Waitlist Confirmation';
    bodyContent = `
      <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 12px;">You're on the list!</h2>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        We have successfully added you to the Reservi Waitlist.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        Reservi is launching soon in Casablanca, and you will be among the first to enjoy early access privileges.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 0;">
        Cheers,<br>
        <strong>The Reservi Team</strong>
      </p>
    `;
  } else if (type === 'partner') {
    subject = 'Reservi Partner Application Received';
    bodyContent = `
      <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 12px;">Thank you for your request!</h2>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        We have received your application to join the Reservi Restaurant Network.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        Our team is currently reviewing your details and will reach out to you within 2 business days.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 0;">
        Warmly,<br>
        <strong>The Reservi Team</strong>
      </p>
    `;
  } else if (type === 'contact') {
    subject = 'Reservi Support - Message Received';
    bodyContent = `
      <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 12px;">Message Received!</h2>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        Thank you for reaching out to us. We have received your message.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        Our support coordinators are reviewing your inquiry and will follow up as promptly as possible.
      </p>
      <p style="font-size: 15px; color: #374151; margin-bottom: 0;">
        Best regards,<br>
        <strong>The Reservi Support Team</strong>
      </p>
    `;
  } else {
    return response.status(400).json({ error: 'Invalid type provided' });
  }

  const htmlTemplate = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.5;">
      <h1 style="color: #B91C1C; font-size: 24px; font-weight: bold; margin-bottom: 24px; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px;">Reservi</h1>
      ${bodyContent}
      <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
        <p style="margin: 0;">© 2026 Reservi. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">Contact: admin@reservi-eat.ma</p>
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
