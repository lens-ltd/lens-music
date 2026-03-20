export const renderEmailLayout = ({
  preview,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaUrl,
  footer,
}: {
  preview: string;
  eyebrow: string;
  title: string;
  body: string[];
  ctaLabel: string;
  ctaUrl: string;
  footer: string;
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f1e8;font-family:Arial,sans-serif;color:#100e09;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #eadfca;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2854c5;">${eyebrow}</p>
                <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;">${title}</h1>
                ${body.map((paragraph) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:rgba(16,14,9,0.72);">${paragraph}</p>`).join('')}
                <p style="margin:28px 0;">
                  <a href="${ctaUrl}" style="display:inline-block;background:#2854c5;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:14px;">${ctaLabel}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(16,14,9,0.55);">${footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
