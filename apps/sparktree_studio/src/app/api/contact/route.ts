import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, budget, timeline, message } = body;

    if (!name || typeof name !== 'string' || name.length < 2) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'El email no es válido' }, { status: 400 });
    }

    const sanitize = (val: unknown) =>
      typeof val === 'string'
        ? val.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        : '';

    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhone = sanitize(phone || 'No especificado');
    const sanitizedCompany = sanitize(company || 'No especificada');
    const sanitizedBudget = sanitize(budget || 'No especificado');
    const sanitizedTimeline = sanitize(timeline || 'No especificado');
    const sanitizedMessage = sanitize(message || '');
    const sanitizedServices = Array.isArray(service)
      ? service.map(sanitize).join(', ')
      : sanitize(service || 'No especificado');

    if (!resend) {
      console.log('RESEND_API_KEY no configurado. Mensaje recibido simulado:', {
        sanitizedName,
        sanitizedEmail,
        sanitizedPhone,
      });
      return NextResponse.json({
        success: true,
        mock: true,
        message: 'Solicitud recibida correctamente',
      });
    }

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sparktree.rs@gmail.com',
      subject: `Nuevo contacto: ${sanitizedName}`,
      html: `
        <div style="font-family: sans-serif; background-color: #0a0a0a; padding: 40px 20px; color: #f3f4f6;">
          <div style="max-width: 550px; margin: 0 auto; background: #171717; border: 1px solid #333333; border-radius: 8px; padding: 30px;">
            <h2 style="color: #41f0a5; font-size: 16px; text-transform: uppercase;">Nueva Solicitud de Contacto</h2>
            <p><strong>Nombre:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            <p><strong>Teléfono:</strong> ${sanitizedPhone}</p>
            <p><strong>Empresa:</strong> ${sanitizedCompany}</p>
            <p><strong>Servicios:</strong> ${sanitizedServices}</p>
            <p><strong>Presupuesto:</strong> ${sanitizedBudget}</p>
            <p><strong>Plazo:</strong> ${sanitizedTimeline}</p>
            <p><strong>Mensaje:</strong></p>
            <blockquote style="background: #262626; padding: 12px; border-left: 3px solid #41f0a5;">
              ${sanitizedMessage}
            </blockquote>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
