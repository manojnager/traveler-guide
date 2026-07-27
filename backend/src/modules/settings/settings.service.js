import prisma from "../../lib/prisma.js";

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
  { key: "currency", value: "USD", group: "booking" }
];

export const getAllSettings = async () => {
  const existing = await prisma.setting.findMany();
  const existingKeys = new Set(existing.map((s) => s.key));

  const missingDefaults = DEFAULT_SETTINGS.filter(
    (d) => !existingKeys.has(d.key)
  );

  if (missingDefaults.length) {
    await prisma.setting.createMany({
      data: missingDefaults,
      skipDuplicates: true
    });
  }

  const all = await prisma.setting.findMany({
    orderBy: { key: "asc" }
  });

  return all.reduce((grouped, setting) => {
    if (!grouped[setting.group]) {
      grouped[setting.group] = {};
    }
    grouped[setting.group][setting.key] = setting.value;
    return grouped;
  }, {});
};

export const updateSettings = async (payload) => {
  const entries = [];

  Object.entries(payload).forEach(([group, fields]) => {
    Object.entries(fields).forEach(([key, value]) => {
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