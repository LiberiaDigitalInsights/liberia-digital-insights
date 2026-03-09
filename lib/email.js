import nodemailer from "nodemailer";
import { supabase } from "./supabase";

async function getSmtpSettings() {
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "global")
    .single();
  return data?.value || {};
}

/**
 * Sends an email using SMTP settings.
 * If settings are not provided, it fetches them from the database.
 */
export async function sendEmail({ to, subject, html, settings }) {
  // Use provided settings or fetch from database
  const activeSettings = settings || (await getSmtpSettings());

  const config = {
    host: activeSettings.smtpHost || process.env.SMTP_HOST,
    port: parseInt(activeSettings.smtpPort || process.env.SMTP_PORT || "587"),
    secure: activeSettings.smtpSecure ?? process.env.SMTP_SECURE === "true",
    auth: {
      user: activeSettings.smtpUser || process.env.SMTP_USER,
      pass: activeSettings.smtpPassword || process.env.SMTP_PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: `"${activeSettings.siteName || "Liberia Digital Insights"}" <${activeSettings.contactEmail || process.env.SMTP_FROM || config.auth.user}>`,
    to,
    subject,
    html,
  });

  return info;
}

/**
 * Verifies SMTP connection for testing purposes.
 */
export async function verifySmtp(settings) {
  const config = {
    host: settings.smtpHost,
    port: parseInt(settings.smtpPort),
    secure: settings.smtpSecure,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword,
    },
    // Short timeout for testing
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  };

  const transporter = nodemailer.createTransport(config);
  return await transporter.verify();
}
