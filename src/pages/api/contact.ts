import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be filled' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Implement email sending or save to database
    // For now, just log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send an email using a service like Resend, SendGrid, etc.
    // 2. Or save to a database table for contact submissions
    // 3. Or integrate with a CRM system

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon.' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while sending your message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


