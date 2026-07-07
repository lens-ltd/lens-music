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
  const fontStack =
    "Arial, Helvetica, 'Segoe UI', sans-serif";
  const logoBlock =
    logoUrl.length > 0
      ? `<tr>
        <td style="padding:24px 32px 0;">
          <img src="${logoUrl}" alt="Lens Music" width="100" style="display:inline-block;width:100px;height:auto;border:0;" />
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
  </head>
  <body style="margin:0;padding:0;background:#eef0f2;font-family:${fontStack};color:#1a1a1a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;">
            ${logoBlock}
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${brand};font-family:${fontStack};font-weight:700;">${eyebrow}</p>
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-family:${fontStack};font-weight:700;color:#1a1a1a;">${title}</h1>
                ${body.map((paragraph) => `<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#3f3f3f;font-family:${fontStack};">${paragraph}</p>`).join('')}
                <p style="margin:24px 0;">
                  <a href="${ctaUrl}" style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;padding:10px 22px;border-radius:4px;font-size:13px;font-family:${fontStack};font-weight:700;">${ctaLabel}</a>
                </p>
                <p style="margin:0;font-size:11px;line-height:1.5;color:#6b6b6b;font-family:${fontStack};">${footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:10px;color:#8a8a8a;font-family:${fontStack};">
            &copy; ${year} Lens Music &middot; Kigali, Rwanda
          </p>
          <p style="margin:4px 0 0;font-size:10px;font-family:${fontStack};">
            <a href="${appUrl}" style="color:#8a8a8a;text-decoration:underline;">lens.rw</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
