import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5, // Máximo de peticiones por ventana
  windowMs: 60 * 60 * 1000, // 1 hora en milisegundos
};

// Almacenamiento en memoria para rate limiting (nota: en serverless, esto se reinicia con cada instancia)
// Para producción, considera usar Redis o un servicio de rate limiting dedicado
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Función para obtener IP del cliente
function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Función para verificar rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    // Primer request de esta IP
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  // Verificar si la ventana de tiempo ha expirado
  if (now > record.resetTime) {
    // Reiniciar contador
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  // Verificar si excede el límite
  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  // Incrementar contador
  record.count++;
  rateLimitStore.set(ip, record);
  return true;
}

// Limpieza periódica de registros expirados
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Limpiar cada 5 minutos

export default async function handler(req: any, res: any) {
  // Configuración CORS restringida
  const allowedOrigins = [
    'https://sparktree.pe',
    'https://www.sparktree.pe',
    'https://empresa-sparktree.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    const record = rateLimitStore.get(clientIP);
    const retryAfter = Math.ceil((record!.resetTime - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Demasiadas peticiones. Por favor, espera antes de intentar nuevamente.',
      retryAfter: `${retryAfter} segundos`,
    });
  }

  try {
    const { name, email, phone, company, service, budget, timeline, message } = req.body;

    // Validación de entrada
    const validationErrors: string[] = [];

    // Validar nombre (2-100 caracteres, solo letras y espacios)
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
      validationErrors.push('El nombre debe tener entre 2 y 100 caracteres');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
      validationErrors.push('El nombre solo puede contener letras y espacios');
    }

    // Validar email
    if (!email || typeof email !== 'string') {
      validationErrors.push('El email es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        validationErrors.push('El formato del email no es válido');
      }
      if (email.length > 255) {
        validationErrors.push('El email no puede exceder 255 caracteres');
      }
    }

    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (phone && typeof phone === 'string') {
      const phoneRegex = /^\+?[\d\s\-\(\)]{8,20}$/;
      if (!phoneRegex.test(phone.trim())) {
        validationErrors.push('El formato del teléfono no es válido');
      }
    }

    // Validar empresa (opcional, máximo 100 caracteres)
    if (company && typeof company === 'string' && company.length > 100) {
      validationErrors.push('El nombre de la empresa no puede exceder 100 caracteres');
    }

    // Validar servicios (array de strings)
    if (service && !Array.isArray(service)) {
      validationErrors.push('Los servicios deben ser un array');
    } else if (service && Array.isArray(service)) {
      if (service.length > 10) {
        validationErrors.push('No puedes seleccionar más de 10 servicios');
      }
      service.forEach((s: any) => {
        if (typeof s !== 'string' || s.length > 50) {
          validationErrors.push('Cada servicio debe ser un texto de máximo 50 caracteres');
        }
      });
    }

    // Validar presupuesto (opcional, máximo 50 caracteres)
    if (budget && typeof budget === 'string' && budget.length > 50) {
      validationErrors.push('El presupuesto no puede exceder 50 caracteres');
    }

    // Validar timeline (opcional, máximo 50 caracteres)
    if (timeline && typeof timeline === 'string' && timeline.length > 50) {
      validationErrors.push('El plazo no puede exceder 50 caracteres');
    }

    // Validar mensaje (10-2000 caracteres)
    if (!message || typeof message !== 'string' || message.length < 10 || message.length > 2000) {
      validationErrors.push('El mensaje debe tener entre 10 y 2000 caracteres');
    }

    // Si hay errores de validación, retornar error 400
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Error de validación',
        details: validationErrors,
      });
    }

    // Sanitización de datos para prevenir XSS
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPhone = phone ? sanitizeInput(phone.trim()) : '';
    const sanitizedCompany = company ? sanitizeInput(company.trim()) : 'No especificada';
    const sanitizedBudget = budget ? sanitizeInput(budget.trim()) : 'No especificado';
    const sanitizedTimeline = timeline ? sanitizeInput(timeline.trim()) : 'No especificado';
    const sanitizedMessage = sanitizeInput(message.trim());
    const sanitizedServices = service && Array.isArray(service) 
      ? service.map((s: string) => sanitizeInput(s.trim())).join(', ') 
      : 'No especificado';

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sparktree.rs@gmail.com',
      subject: `Nuevo contacto: ${sanitizedName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0a; padding: 40px 20px; color: #f3f4f6; text-align: center;">
          <div style="max-width: 550px; margin: 0 auto; background: #171717; border: 1px solid #333333; border-radius: 8px; overflow: hidden; text-align: left; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            
            <div style="padding: 35px 30px 25px 30px; border-bottom: 1px solid #262626; text-align: center; background-color: #0f0f0f;">
              <!-- Asegúrate de reemplazar 'https://www.tudominio.com' por tu dominio real donde esté alojada la imagen -->
              <img src="https://tudominio.com/assets/sparktree-horizontal.png" alt="Sparktree Logo" style="max-width: 180px; height: auto;" />
              <h2 style="margin: 25px 0 0 0; color: #41f0a5; font-size: 16px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Nueva Solicitud de Contacto</h2>
            </div>

            <div style="padding: 35px 30px;">
              <p style="font-size: 14px; color: #a3a3a3; margin-bottom: 30px; line-height: 1.5;">Se ha registrado una nueva consulta a través del sitio web. A continuación se detallan los datos del prospecto:</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #d4d4d4;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373; width: 40%;">Nombre Completo:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600; color: #ffffff;">${sanitizedName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Correo Electrónico:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600;"><a href="mailto:${sanitizedEmail}" style="color: #41f0a5; text-decoration: none;">${sanitizedEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Teléfono de Contacto:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600;"><a href="tel:${sanitizedPhone}" style="color: #41f0a5; text-decoration: none;">${sanitizedPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Empresa:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600; color: #ffffff;">${sanitizedCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Servicios Requeridos:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600; color: #ffffff;">${sanitizedServices}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Presupuesto Estimado:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600; color: #41f0a5;">${sanitizedBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373;">Plazo del Proyecto:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-weight: 600; color: #ffffff;">${sanitizedTimeline}</td>
                </tr>
              </table>

              <div style="margin-top: 35px; background-color: #262626; padding: 20px 24px; border-radius: 6px; border-left: 3px solid #41f0a5;">
                <h3 style="margin-top: 0; margin-bottom: 10px; color: #ffffff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje Adjunto:</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #d4d4d4; white-space: pre-wrap;">${sanitizedMessage}</p>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; background-color: #0f0f0f; border-top: 1px solid #262626; font-size: 12px; color: #525252;">
              Este es un correo automatizado generado por el sistema de <strong>Sparktree</strong>.
            </div>

          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
}
