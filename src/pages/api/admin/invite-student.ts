import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { isAdmin } from '../../../lib/admin';
import { isValidEmail } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const session = await getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.userId);
    if (!userIsAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { email, name, message } = body;

    // Validate input
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the base URL for the invitation link
    const baseUrl = process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
    const registerUrl = `${baseUrl}/register`;

    // Prepare email content
    const emailSubject = name 
      ? `Welcome to Lakshya Counselling, ${name}!`
      : 'Welcome to Lakshya Counselling!';
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Lakshya Counselling</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Career Assessment!</h2>
            
            ${name ? `<p>Hello ${name},</p>` : '<p>Hello,</p>'}
            
            <p>You've been invited to take part in our comprehensive career assessment tests. These tests will help you gain valuable insights into your:</p>
            
            <ul style="margin: 20px 0; padding-left: 20px;">
              <li>Personality traits</li>
              <li>Career interests</li>
              <li>Work values</li>
              <li>Aptitude and skills</li>
              <li>Behavioral patterns</li>
            </ul>
            
            ${message ? `<div style="background: #fff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">${message}</p>
            </div>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${registerUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; font-size: 16px;">
                Get Started
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:support@lakshayacounselling.com" style="color: #667eea;">support@lakshayacounselling.com</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This invitation was sent to ${email}. If you didn't expect this email, you can safely ignore it.
            </p>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Welcome to Lakshya Counselling!

${name ? `Hello ${name},` : 'Hello,'}

You've been invited to take part in our comprehensive career assessment tests. These tests will help you gain valuable insights into your personality traits, career interests, work values, aptitude, and behavioral patterns.

${message ? `\nMessage: ${message}\n` : ''}

Get started by visiting: ${registerUrl}

If you have any questions, feel free to reach out to us at support@lakshayacounselling.com

---
This invitation was sent to ${email}. If you didn't expect this email, you can safely ignore it.
    `;

    // Send email using Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Dynamic import to avoid module resolution issues
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send invitation email', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation sent successfully',
        emailId: data?.id,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Invite student error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while sending the invitation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

