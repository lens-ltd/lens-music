const brand = '#1f628e';

export const renderEmailLayout = ({
  preview,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaUrl,
  footer,
  logoUrl = '',
  appUrl = '',
}: {
  preview: string;
  eyebrow: string;
  title: string;
  body: string[];
  ctaLabel: string;
  ctaUrl: string;
  footer: string;
  logoUrl?: string;
  appUrl?: string;
}) => {
  const year = new Date().getFullYear();
  const logoBlock =
    logoUrl.length > 0
      ? `<tr>
        <td style="padding:32px 40px 0;text-align:center;">
          <img src="${logoUrl}" alt="Lens Music" width="120" style="display:inline-block;width:120px;height:auto;border:0;" />
        </td>
      </tr>`
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Poppins:wght@400;500;600&display=swap');
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f6f1e8;font-family:'Poppins',Arial,sans-serif;color:#100e09;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #eadfca;border-radius:20px;overflow:hidden;border-top:3px solid ${brand};">
            ${logoBlock}
            <tr>
              <td style="padding:32px 40px 40px;">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${brand};font-family:'Poppins',Arial,sans-serif;font-weight:500;">${eyebrow}</p>
                <h1 style="margin:0 0 20px;font-size:30px;line-height:1.15;font-family:'Libre Baskerville',Georgia,serif;font-weight:700;color:#100e09;">${title}</h1>
                ${body.map((paragraph) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:rgba(16,14,9,0.72);font-family:'Poppins',Arial,sans-serif;">${paragraph}</p>`).join('')}
                <p style="margin:32px 0;">
                  <a href="${ctaUrl}" style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-family:'Poppins',Arial,sans-serif;font-weight:600;">${ctaLabel}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(16,14,9,0.55);font-family:'Poppins',Arial,sans-serif;">${footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;text-align:center;">
          <p style="margin:0;font-size:11px;color:rgba(16,14,9,0.45);font-family:'Poppins',Arial,sans-serif;">
            &copy; ${year} Lens Music &middot; Kigali, Rwanda
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:rgba(16,14,9,0.35);font-family:'Poppins',Arial,sans-serif;">
            <a href="${appUrl}" style="color:rgba(16,14,9,0.45);text-decoration:underline;">lens.rw</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
