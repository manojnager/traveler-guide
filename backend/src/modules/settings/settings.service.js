import prisma from "../../lib/prisma.js";
import { encrypt } from "../../utils/encryption.js";

const DEFAULT_SETTINGS = [
  { key: "site_name", value: "Traveler Guide", group: "general" },
  { key: "site_logo", value: "", group: "general" },
  { key: "contact_email", value: "", group: "general" },
  { key: "contact_phone", value: "", group: "general" },
  { key: "address", value: "", group: "general" },
  { key: "facebook_url", value: "", group: "social" },
  { key: "instagram_url", value: "", group: "social" },
  { key: "twitter_url", value: "", group: "social" },
  { key: "default_meta_title", value: "", group: "seo" },
  { key: "default_meta_description", value: "", group: "seo" },
  { key: "default_cancellation_policy", value: "", group: "booking" },
  { key: "currency", value: "USD", group: "booking" },
  { key: "smtp_host", value: "", group: "smtp" },
  { key: "smtp_port", value: "587", group: "smtp" },
  { key: "smtp_security", value: "tls", group: "smtp" },
  { key: "smtp_username", value: "", group: "smtp" },
  { key: "smtp_password", value: "", group: "smtp" },
  { key: "smtp_from_name", value: "TravelerGuide", group: "smtp" },
  { key: "smtp_from_email", value: "", group: "smtp" },
  { key: "smtp_notify_email", value: "", group: "smtp" }
];

export const getAllSettings = async () => {
  const existing = await prisma.setting.findMany();
  const existingKeys = new Set(existing.map((s) => s.key));
  const missingDefaults = DEFAULT_SETTINGS.filter((d) => !existingKeys.has(d.key));

  if (missingDefaults.length) {
    await prisma.setting.createMany({
      data: missingDefaults,
      skipDuplicates: true
    });
  }

  const all = await prisma.setting.findMany({
    orderBy: { key: "asc" }
  });

  const grouped = all.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = {};
    }
    acc[setting.group][setting.key] = setting.value;
    return acc;
  }, {});

  // Never send the encrypted password to the frontend — only a flag showing one is set
  if (grouped.smtp) {
    grouped.smtp.smtp_password_is_set = Boolean(grouped.smtp.smtp_password);
    grouped.smtp.smtp_password = "";
  }

  return grouped;
};

export const updateSettings = async (payload) => {
  const entries = [];

  Object.entries(payload).forEach(([group, fields]) => {
    Object.entries(fields).forEach(([key, value]) => {
      if (group === "smtp" && key === "smtp_password") {
        // Skip overwriting the stored password if the field was left blank
        if (!value) return;
        entries.push({ key, value: encrypt(value), group });
        return;
      }

      if (group === "smtp" && key === "smtp_password_is_set") {
        // Frontend-only display flag, never persisted
        return;
      }

      entries.push({ key, value: value ?? "", group });
    });
  });

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.setting.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group },
        create: entry
      })
    )
  );

  return getAllSettings();
};