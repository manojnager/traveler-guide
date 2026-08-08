import Stripe from "stripe";
import prisma from "../lib/prisma.js";
import { decrypt } from "./encryption.js";

export const getStripeConfig = async () => {
  const rows = await prisma.setting.findMany({ where: { group: "stripe" } });
  const config = {};
  rows.forEach((row) => {
    config[row.key] = row.value;
  });

  return {
    publishableKey: config.stripe_publishable_key || "",
    secretKey: config.stripe_secret_key ? decrypt(config.stripe_secret_key) : "",
    enabled: config.stripe_enabled === "true"
  };
};

export const getStripeClient = async () => {
  const config = await getStripeConfig();

  if (!config.secretKey) {
    throw new Error("Stripe secret key is not configured.");
  }

  return new Stripe(config.secretKey);
};