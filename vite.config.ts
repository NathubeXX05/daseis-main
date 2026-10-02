import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { Resend } from 'resend';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'resend-api-endpoint',
        configureServer(server) {
          server.middlewares.use('/api/contact', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const { name, businessName, activity, email, phone, message, role } = data;
                  const roleLabel = role === 'fournisseur' ? 'Fournisseur / Distributeur' : 'Institut / Salon / Artisan';

                  if (!resend) {
                    throw new Error('Clé RESEND_API_KEY manquante dans le fichier .env');
                  }

                  const sendResult = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: 'daseis.foundation@gmail.com',
                    subject: `Demande Daseis - ${name || 'Nouveau contact'} (${businessName || roleLabel})`,
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                        <h2 style="color: #2563eb; margin-top: 0;">Nouvelle demande reçue sur Daseis</h2>
                        <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
                        <p><strong>Profil :</strong> ${roleLabel}</p>
                        <p><strong>Nom & Prénom :</strong> ${name || 'Non renseigné'}</p>
                        <p><strong>Établissement / Enseigne :</strong> ${businessName || 'Non renseigné'}</p>
                        <p><strong>Email :</strong> <a href="mailto:${email}">${email || 'Non renseigné'}</a></p>
                        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
                        <p><strong>Produits / Besoins :</strong> ${activity || 'Non renseigné'}</p>
                        <p><strong>Message :</strong></p>
                        <blockquote style="background: #f8fafc; border-left: 3px solid #3b82f6; margin: 0; padding: 12px;">${message || 'Aucun message particulier'}</blockquote>
                        <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0 10px 0;" />
                        <p style="font-size: 11px; color: #64748b;">Notification automatique Daseis via Resend API.</p>
                      </div>
                    `,
                  });

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, result: sendResult }));
                } catch (error: any) {
                  console.error('Erreur API Resend :', error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: error.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
