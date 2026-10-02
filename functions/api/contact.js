/**
 * Cloudflare Pages Function pour traiter le formulaire de contact Daseis
 * Route : POST /api/contact
 */

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY absente des variables Cloudflare Pages.');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Clé RESEND_API_KEY non configurée dans Cloudflare Pages (Settings > Environment variables).',
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const data = await request.json();
    const { name, businessName, activity, email, phone, message, role } = data;
    const roleLabel = role === 'fournisseur' ? 'Fournisseur / Distributeur' : 'Institut / Salon / Artisan';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 22px;">Nouvelle demande reçue sur Daseis</h2>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 160px;"><strong>Profil :</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${roleLabel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Nom & Prénom :</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${name || 'Non renseigné'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Établissement / Enseigne :</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${businessName || 'Non renseigné'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Email :</strong></td>
            <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email || 'Non renseigné'}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Téléphone :</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${phone || 'Non renseigné'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Produits / Besoins :</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${activity || 'Non renseigné'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px;">
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;"><strong>Message :</strong></p>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 4px; font-size: 14px; color: #334155; white-space: pre-wrap;">${message || 'Aucun message spécifique'}</div>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 12px 0;" />
        <p style="font-size: 12px; color: #94a3b8; margin: 0; text-align: center;">Notification automatique envoyée à daseis.foundation@gmail.com via Cloudflare Pages Function & Resend API.</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['daseis.foundation@gmail.com'],
        subject: `Demande Daseis - ${name || 'Nouveau contact'} (${businessName || roleLabel})`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Erreur API Resend :', resendData);
      return new Response(JSON.stringify({ success: false, error: resendData }), {
        status: resendResponse.status,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true, result: resendData }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Erreur interne Cloudflare Function :', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Erreur interne lors de l’envoi de l’email',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
