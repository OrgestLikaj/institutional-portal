import { NextResponse } from "next/server";
import { LIMITS, validateContact, type ContactInput } from "@/lib/validation/contact";

/**
 * Contact form endpoint.
 * Validates server-side, rejects bots (honeypot) and then hands the message to
 * a delivery adapter. In the prototype the adapter only logs; connect it to
 * SMTP, a ticketing system or a WordPress form plugin before going live.
 *
 * Demo tip: a subject of exactly "test-error" simulates a delivery failure so
 * the error state can be shown during the presentation.
 */
export async function POST(request: Request) {
  let body: Partial<ContactInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const input: ContactInput = {
    name: String(body.name ?? "").slice(0, LIMITS.name),
    email: String(body.email ?? "").slice(0, LIMITS.email),
    subject: String(body.subject ?? "").slice(0, LIMITS.subject),
    message: String(body.message ?? "").slice(0, LIMITS.message),
    consent: body.consent === true,
    website: String(body.website ?? ""),
  };

  // Bots fill the hidden field: pretend success, store nothing.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateContact(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  if (input.subject.trim().toLowerCase() === "test-error") {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  await deliver(input);
  return NextResponse.json({ ok: true });
}

async function deliver(input: ContactInput) {
  // Placeholder delivery: no personal data is persisted in the prototype.
  console.info(`[contact] message received (subject length ${input.subject.length}, message length ${input.message.length})`);
}
