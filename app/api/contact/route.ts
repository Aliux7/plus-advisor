import { NextResponse, type NextRequest } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import nodemailer from "nodemailer";
import { getFirebaseDb } from "../../admin/lib/firebase";
import {
  CONTACT_SUBMISSIONS_COLLECTION,
  getContactSettings,
  type ContactSubmissionInput,
} from "../../admin/lib/contact";

export const runtime = "nodejs";

function parsePayload(raw: unknown): ContactSubmissionInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const bool = (v: unknown) => v === true;
  const firstName = str(r.firstName).trim();
  const lastName = str(r.lastName).trim();
  const email = str(r.email).trim();
  const contactMethod = str(r.contactMethod).trim();
  const residences = str(r.residences).trim();
  const assets = str(r.assets).trim();
  if (!firstName || !lastName || !email || !contactMethod || !residences || !assets) {
    return null;
  }
  return {
    firstName,
    lastName,
    name: str(r.name) || `${firstName} ${lastName}`.trim(),
    email,
    phoneCountryCode: str(r.phoneCountryCode).trim(),
    phoneNumber: str(r.phoneNumber).trim(),
    phone: str(r.phone).trim(),
    contactMethod,
    residences,
    assets,
    message: str(r.message).trim(),
    readyForAdvisor: bool(r.readyForAdvisor),
    preferConversation: bool(r.preferConversation),
    locale: str(r.locale).trim(),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmail(input: ContactSubmissionInput): {
  subject: string;
  html: string;
  text: string;
} {
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Preferred Contact", input.contactMethod],
    ["Residences", input.residences],
    ["Assets", input.assets],
    ["Ready for Advisor", input.readyForAdvisor ? "Yes" : "No"],
    ["Prefer Conversation", input.preferConversation ? "Yes" : "No"],
    ["Locale", input.locale],
    ["Message", input.message || "—"],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0b1f3a;line-height:1.5">
      <h2 style="margin:0 0 16px">New Contact Submission</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="background:#f4f4f6;font-weight:600;vertical-align:top">${escapeHtml(
                k,
              )}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(
                v,
              )}</td></tr>`,
          )
          .join("")}
      </table>
    </div>
  `;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return {
    subject: `New contact submission — ${input.name}`,
    html,
    text,
  };
}

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parsePayload(json);
  if (!input) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await addDoc(collection(getFirebaseDb(), CONTACT_SUBMISSIONS_COLLECTION), {
      ...input,
      submittedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[contact] firestore write failed", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailAppPassword) {
    try {
      const { notifyTo } = await getContactSettings();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailAppPassword },
      });
      const { subject, html, text } = renderEmail(input);
      await transporter.sendMail({
        from: `"Plus Advisor" <${gmailUser}>`,
        to: notifyTo,
        replyTo: input.email,
        subject,
        html,
        text,
      });
    } catch (err) {
      console.error("[contact] email send failed", err);
    }
  } else {
    console.warn(
      "[contact] GMAIL_USER or GMAIL_APP_PASSWORD missing — skipping email notification",
    );
  }

  return NextResponse.json({ ok: true });
}
