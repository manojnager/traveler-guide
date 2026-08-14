import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { sendEmail, getSmtpNotifyEmail } from "../../utils/mailer.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";

export const createContactMessage = async (data) => {
  const contactMessage = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      destination: data.destination || null,
      travelDate: data.travelDate ? new Date(data.travelDate) : null,
      guests: data.guests || null,
      budget: data.budget || null,
      subject: data.subject || null,
      message: data.message
    }
  });

  const notifyEmail = await getSmtpNotifyEmail();

  if (notifyEmail) {
    await sendEmail({
      to: notifyEmail,
      subject: `New Contact Message: ${data.subject || "General Inquiry"}`,
      type: "contact_admin_notification",
      html: wrapEmailTemplate({
        title: "New Contact Message",
        preheader: `New message from ${data.name}`,
        bodyHtml: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:22px; font-weight:bold; color:#08111F; padding-bottom:20px;">New Contact Form Submission</td></tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${[
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone || "-"],
              ["Destination", data.destination || "-"],
              ["Travel Date", data.travelDate || "-"],
              ["Guests", data.guests || "-"],
              ["Budget", data.budget || "-"]
            ]
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:10px 0; font-size:13px; color:#6c7a91; width:140px; border-bottom:1px solid #EEE;">${label}</td>
                <td style="padding:10px 0; font-size:14px; color:#08111F; font-weight:600; border-bottom:1px solid #EEE;">${value}</td>
              </tr>
            `
              )
              .join("")}
          </table>

          <p style="margin:0 0 8px; font-size:13px; color:#6c7a91; text-transform:uppercase; letter-spacing:1px;">Message</p>
          <div style="background:#F4F1EA; border:1px solid #EEE; border-radius:10px; padding:18px; font-size:14px; color:#2A2E35; line-height:1.7;">
            ${data.message}
          </div>
        `
      })
    });
  }

  await sendEmail({
    to: data.email,
    subject: "We received your message — TravelerGuide",
    type: "contact_user_confirmation",
    html: wrapEmailTemplate({
      title: "Message Received",
      preheader: "Thanks for reaching out — we'll be in touch within 24 hours.",
      bodyHtml: `
        <p style="margin:0 0 6px; font-size:13px; color:#C8A96A; letter-spacing:2px; text-transform:uppercase;">Thank You</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:24px; font-weight:bold; color:#08111F; line-height:1.4;">We've received your message, ${data.name}</td></tr>
        </table>

        <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.8;">
          One of our travel designers will get back to you within 24 hours to help plan your next journey.
        </p>

        <p style="margin:0 0 8px; font-size:13px; color:#6c7a91; text-transform:uppercase; letter-spacing:1px;">Your Message</p>
        <div style="background:#F4F1EA; border:1px solid #EEE; border-radius:10px; padding:18px; font-size:14px; color:#2A2E35; line-height:1.7;">
          ${data.message}
        </div>
      `
    })
  });

  return contactMessage;
};

export const getAdminContactMessages = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
      { subject: { contains: query.search } }
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.contactMessage.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

export const getContactMessageById = async (id) => {
  const message = await prisma.contactMessage.findUnique({ where: { id: Number(id) } });

  if (!message) {
    throw new AppError("Message not found.", 404);
  }

  return message;
};

export const updateContactMessageStatus = async (id, status) => {
  await getContactMessageById(id);

  return prisma.contactMessage.update({
    where: { id: Number(id) },
    data: { status }
  });
};

export const deleteContactMessage = async (id) => {
  await getContactMessageById(id);
  return prisma.contactMessage.delete({ where: { id: Number(id) } });
};