export const wrapEmailTemplate = ({ preheader = "", title, bodyHtml, bannerImage }) => {
  const banner = bannerImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title || "TravelerGuide"}</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F1EA; font-family: Arial, Helvetica, sans-serif;">
  <span style="display:none; font-size:1px; color:#F4F1EA; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${preheader}
  </span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F1EA; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(8,17,31,0.08);">

          <!-- Banner -->
          <!-- <tr>
            <td style="position:relative;">
              <img src="${banner}" alt="TravelerGuide" width="600" style="width:100%; max-width:600px; height:200px; object-fit:cover; display:block;" />
            </td>
          </tr> -->

          <!-- Logo bar -->
          <tr>
            <td align="center" style="padding:26px 30px; background-color:#08111F;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: 'Times New Roman', Georgia, serif; font-size:24px; font-weight:bold; color:#C8A96A; padding-right:8px;"><img src='https://probuilt.hipl-staging5.com/wp-content/uploads/2026/07/logoemail.png'></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px; color:#2A2E35;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- CTA band -->
          <tr>
            <td align="center" style="padding:0 40px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#C8A96A; border-radius:8px;">
                    <a href="https://travelerguide.com" style="display:block; padding:14px 36px; font-size:13px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; color:#08111F; text-decoration:none;">
                      Explore Destinations
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px; background-color:#08111F;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px; font-size:13px; color:#B6C2D2; line-height:1.7;">
                    Discover extraordinary destinations through handcrafted luxury journeys,<br />
                    exceptional hospitality, and unforgettable experiences around the world.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:16px; font-size:13px; color:#B6C2D2;">
                    Jaipur, Rajasthan, India &nbsp;·&nbsp; +91 98765 43210 &nbsp;·&nbsp;
                    <a href="mailto:hello@travelerguide.com" style="color:#C8A96A; text-decoration:none;">hello@travelerguide.com</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:18px; font-size:13px;">
                    <a href="#" style="color:#C8A96A; text-decoration:none; margin:0 10px;">Instagram</a>
                    <a href="#" style="color:#C8A96A; text-decoration:none; margin:0 10px;">Facebook</a>
                    <a href="#" style="color:#C8A96A; text-decoration:none; margin:0 10px;">YouTube</a>
                    <a href="#" style="color:#C8A96A; text-decoration:none; margin:0 10px;">Pinterest</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px; color:#6c7a91;">
                    © ${new Date().getFullYear()} TravelerGuide. All Rights Reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};