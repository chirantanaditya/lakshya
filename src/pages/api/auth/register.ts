import type { APIRoute } from 'astro';
import { createUser, isValidEmail, validatePasswordStrength } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const { name, email, password, firstName, lastName, phoneNo, education } = data;

    // Validate required fields
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name must be between 2 and 100 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create user (createUser will check for existing email)
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      phoneNo: phoneNo?.trim(),
      education,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account created successfully',
        user: { id: user.id, email: user.email, name: user.name } 
      }),
      { 
        status: 201, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        } 
      }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.message === 'User with this email already exists') {
      return new Response(
        JSON.stringify({ error: 'An account with this email already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'An error occurred during registration. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

