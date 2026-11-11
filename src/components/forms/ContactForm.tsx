"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import { LIMITS, validateContact, type ContactErrors, type ContactInput } from "@/lib/validation/contact";

type Status = "idle" | "sending" | "success" | "error";

const empty: ContactInput = { name: "", email: "", subject: "", message: "", consent: false, website: "" };

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const { locale, t } = useI18n();
  const [values, setValues] = useState<ContactInput>({ ...empty, subject: defaultSubject });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const msg = (key?: string) => (key ? t.contact.errors[key as keyof typeof t.contact.errors] : undefined);

  const update = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors(validateContact(next));
  };

  const blur = (key: keyof ContactInput) => {
    setTouched((cur) => ({ ...cur, [key]: true }));
    setErrors(validateContact(values));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true, consent: true });
    if (Object.keys(found).length) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        setShowSummary(true);
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setStatus(res.ok && data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-success/30 bg-success/[0.05] p-8 focus:outline-none">
        <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        <h3 className="mt-4 text-[1.5rem] font-semibold">{t.contact.successTitle}</h3>
        <p className="mt-2 text-ink-muted">{t.contact.successText}</p>
        <button
          type="button"
          className="btn-outline mt-6"
          onClick={() => {
            setValues(empty);
            setTouched({});
            setErrors({});
            setStatus("idle");
          }}
        >
          {t.contact.sendAnother}
        </button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  const field = (key: "name" | "email" | "subject") => ({
    id: `c-${key}`,
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => update(key, e.target.value),
    onBlur: () => blur(key),
    "aria-invalid": touched[key] && errors[key] ? true : undefined,
    "aria-describedby": touched[key] && errors[key] ? `c-${key}-error` : undefined,
    maxLength: LIMITS[key],
    className: "field",
  });
  const fieldError = (key: keyof ContactInput) =>
    touched[key] && errors[key] ? (
      <p id={`c-${key}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        {msg(errors[key])}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-describedby="form-intro">
      <p id="form-intro" className="text-sm text-ink-muted">
        {t.contact.formIntro}
      </p>

      {showSummary && errorCount > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-l-[3px] border-danger bg-danger/[0.05] px-4 py-3 focus:outline-none">
          <p className="font-semibold text-danger">{interpolate(t.contact.errors.summary, { count: errorCount })}</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-danger">
            {(Object.keys(errors) as (keyof ContactInput)[]).map((k) => (
              <li key={k}>
                <a href={`#c-${k}`} className="underline">
                  {msg(errors[k])}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="flex gap-3 border border-danger/30 bg-danger/[0.05] p-4 focus:outline-none">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <div>
            <p className="font-semibold text-navy-900">{t.contact.errorTitle}</p>
            <p className="text-sm text-ink-muted">{t.contact.errorText}</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">
            {t.contact.fullName} <span aria-hidden="true" className="text-danger">*</span>
          </label>
          <input {...field("name")} type="text" autoComplete="name" required />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            {t.contact.emailAddress} <span aria-hidden="true" className="text-danger">*</span>
          </label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required />
          {fieldError("email")}
        </div>
      </div>

      <div>
        <label htmlFor="c-subject" className="field-label">
          {t.contact.subject} <span aria-hidden="true" className="text-danger">*</span>
        </label>
        <input {...field("subject")} type="text" required />
        {fieldError("subject")}
      </div>

      <div>
        <label htmlFor="c-message" className="field-label">
          {t.contact.message} <span aria-hidden="true" className="text-danger">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={7}
          required
          value={values.message}
          maxLength={LIMITS.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={touched.message && errors.message ? true : undefined}
          aria-describedby={["c-message-count", touched.message && errors.message ? "c-message-error" : ""].filter(Boolean).join(" ")}
          className="field resize-y"
        />
        <div className="flex items-start justify-between gap-4">
          {fieldError("message") ?? <span />}
          <p id="c-message-count" className="mt-1.5 shrink-0 text-xs text-ink-muted">
            {values.message.length} / {LIMITS.message}
          </p>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.95rem]">
          <input
            id="c-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => {
              update("consent", e.target.checked);
              setTouched((cur) => ({ ...cur, consent: true }));
            }}
            aria-invalid={touched.consent && errors.consent ? true : undefined}
            aria-describedby={touched.consent && errors.consent ? "c-consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-navy-900"
          />
          <span>
            {t.contact.consent}{" "}
            <Link href={href(locale, "/privacy")} className="font-semibold text-navy-600 underline">
              {t.nav.privacy}
            </Link>
          </span>
        </label>
        {fieldError("consent")}
      </div>

      <button type="submit" className="btn-primary min-w-48" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t.contact.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            {t.contact.submit}
          </>
        )}
      </button>
    </form>
  );
}
