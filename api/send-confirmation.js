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
  let htmlContent = '';

  if (type === 'waitlist') {
    subject = 'Welcome to Reservi! 🍽️';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.5;">
        <h2 style="color: #EF4444; font-size: 24px; margin-bottom: 16px;">Welcome to the Reservi Waitlist!</h2>
        <p>We are thrilled to have you on board.</p>
        <p>Reservi is reimagining the way you discover and book the best restaurants. You will be the first to know when we launch.</p>
        <p>Stay tuned for updates!</p>
        <br/>
        <p>Best regards,<br/><strong>The Reservi Team</strong></p>
      </div>
    `;
  } else if (type === 'partner') {
    subject = 'Reservi - Partner Application Received';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.5;">
        <h2 style="color: #EF4444; font-size: 24px; margin-bottom: 16px;">Thank you for your partnership request!</h2>
        <p>We have successfully received your details.</p>
        <p>Our partnership team is reviewing your venue's application and will reach out via phone or email within 2 business days.</p>
        <br/>
        <p>Best regards,<br/><strong>The Reservi Team</strong></p>
      </div>
    `;
  } else {
    return response.status(400).json({ error: 'Invalid type provided' });
  }

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
        html: htmlContent
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
