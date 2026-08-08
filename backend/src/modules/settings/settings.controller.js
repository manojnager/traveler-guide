import { successResponse } from "../../responses/apiResponse.js";
import { getAllSettings, updateSettings } from "./settings.service.js";
import { sendEmail } from "../../utils/mailer.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";

export const index = async (req, res, next) => {
  try {
    const settings = await getAllSettings();
    return successResponse(res, "Settings fetched successfully.", settings);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const settings = await updateSettings(req.body);
    return successResponse(res, "Settings updated successfully.", settings);
  } catch (error) {
    next(error);
  }
};

export const testEmail = async (req, res, next) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: "Recipient email is required." });
    }

    const result = await sendEmail({
      to,
      subject: "TravelerGuide SMTP Test Email",
      type: "smtp_test",
      html: wrapEmailTemplate({
        title: "SMTP Test Email",
        preheader: "Your SMTP settings are working correctly.",
        bodyHtml: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:22px; font-weight:bold; color:#08111F;">SMTP Connection Successful</td></tr>
          </table>
          <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.8;">
            This is a test email confirming your SMTP settings are configured and working correctly.
          </p>
        `
      })
    });

    if (!result.success) {
      return res.status(422).json({ success: false, message: result.error || "Failed to send test email." });
    }

    return successResponse(res, "Test email sent successfully.", null);
  } catch (error) {
    next(error);
  }
};