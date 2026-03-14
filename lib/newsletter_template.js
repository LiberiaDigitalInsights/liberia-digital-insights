/**
 * Wraps newsletter content in a branded HTML shell.
 * Uses Liberia Digital Insights design tokens and responsive email best practices.
 */
export function wrapNewsletter(
  content,
  subject,
  siteName = "Liberia Digital Insights",
  unsubLink = "#",
  siteUrl = "https://liberiadigitalinsights.com",
) {
  const brandColor = "#882627";
  const bgColor = "#121212"; // Subtle off-black
  const surfaceColor = "#1a1a1a"; // Slightly lighter surface
  const borderColor = "#2a2a2a";
  const textColor = "#f3f4f6"; // Soft white
  const mutedColor = "#9ca3af"; // Zinc-400
  const currentYear = new Date().getFullYear();
  const logoUrl = `${siteUrl}/LDI_favicon.png`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: ${bgColor};
            color: ${textColor};
            line-height: 1.7;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: ${bgColor};
            padding-top: 20px;
            padding-bottom: 60px;
        }
        .preheader {
            display: none !important;
            visibility: hidden;
            mso-hide: all;
            font-size: 1px;
            line-height: 1px;
            max-height: 0px;
            max-width: 0px;
            opacity: 0;
            overflow: hidden;
        }
        .view-online {
            text-align: center;
            padding: 10px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: ${mutedColor};
        }
        .view-online a {
            color: ${mutedColor};
            text-decoration: underline;
        }
        .main {
            background-color: ${surfaceColor};
            margin: 0 auto;
            width: 100%;
            max-width: 680px; /* Wider for desktop */
            border-spacing: 0;
            color: ${textColor};
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid ${borderColor};
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .header {
            padding: 50px 40px 40px;
            text-align: center;
        }
        .logo {
            width: 64px;
            height: 64px;
            margin-bottom: 20px;
            border-radius: 12px;
        }
        .brand-name {
            margin: 0;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1.5px;
            text-transform: uppercase;
            font-style: italic;
            color: ${textColor};
            line-height: 1;
        }
        .punchline {
            display: block;
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: ${brandColor};
            margin-top: 8px;
            opacity: 0.9;
        }
        .content {
            padding: 0 50px 50px;
            font-size: 16px;
        }
        .content h1, .content h2, .content h3 {
            color: ${textColor};
            font-style: italic;
            font-weight: 900;
            margin-top: 40px;
            margin-bottom: 20px;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: -0.5px;
        }
        .content h1 { font-size: 28px; }
        .content h2 { font-size: 24px; border-left: 4px solid ${brandColor}; padding-left: 15px; }
        .content h3 { font-size: 20px; }
        
        .content p {
            margin-bottom: 25px;
            color: #d1d5db;
        }
        .content a {
            color: ${brandColor};
            text-decoration: none;
            font-weight: bold;
            border-bottom: 1px solid rgba(136, 38, 39, 0.3);
        }
        .content ul, .content ol {
            padding-left: 20px;
            margin-bottom: 25px;
        }
        .content li {
            margin-bottom: 10px;
            color: #d1d5db;
        }
        .footer {
            padding: 40px 50px;
            text-align: center;
            font-size: 12px;
            color: ${mutedColor};
            background-color: rgba(0,0,0,0.2);
            border-top: 1px solid ${borderColor};
        }
        .footer p {
            margin: 8px 0;
        }
        .footer a {
            color: ${textColor};
            text-decoration: none;
            font-weight: bold;
        }
        .unsub-links {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: ${brandColor};
            color: #ffffff !important;
            text-decoration: none !important;
            border-radius: 12px;
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
            letter-spacing: 1.5px;
            margin: 30px 0;
            box-shadow: 0 5px 15px rgba(136, 38, 39, 0.4);
        }
        @media screen and (max-width: 680px) {
            .main {
                border-radius: 0;
                border: none;
            }
            .header, .content, .footer {
                padding-left: 25px;
                padding-right: 25px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="preheader">${subject}</div>
        <div class="view-online">
            Trouble viewing? <a href="${siteUrl}">View in Browser</a>
        </div>
        <table class="main" width="100%">
            <tr>
                <td class="header">
                    <img src="${logoUrl}" alt="LDI Logo" class="logo">
                    <h1 class="brand-name">${siteName}</h1>
                    <span class="punchline">The Weekly Digest</span>
                </td>
            </tr>
            <tr>
                <td class="content">
                    ${content}
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>© ${currentYear} ${siteName}. All rights reserved.</p>
                    <p>Liberia's Gateway to Digital Transformation • Monrovia, Liberia</p>
                    <div class="unsub-links">
                        <p>
                            <a href="${unsubLink}">Unsubscribe</a> • 
                            <a href="${siteUrl}/newsletter/preferences">Manage Preferences</a> •
                            <a href="${siteUrl}/contact">Contact Support</a>
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
  `;
}
