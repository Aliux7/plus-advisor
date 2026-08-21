"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import type { ContactDict } from "../../[lang]/dictionaries";
import { submitContactForm } from "../../admin/lib/contact";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: ContactDict };

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "contactMethod"
  | "residences"
  | "assets"
  | "message";

type Errors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()-]{6,}$/;

export default function ConnectWithAdvisor({ dict }: Props) {
  const params = useParams<{ lang: string }>();
  const [readyForAdvisor, setReadyForAdvisor] = useState(false);
  const [preferConversation, setPreferConversation] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const [contactMethod, setContactMethod] = useState("");
  const [assets, setAssets] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const clearError = (name: FieldName) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (status.kind === "error" || status.kind === "success") {
      setStatus({ kind: "idle" });
    }
  };

  const handleCountryChange = (raw: string) => {
    let cleaned = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    if (cleaned && !cleaned.startsWith("+")) cleaned = "+" + cleaned;
    setPhoneCountry(cleaned.slice(0, 5));
    clearError("phone");
  };

  const handleNumberChange = (raw: string) => {
    setPhoneNumber(raw.replace(/[^\d\s-]/g, ""));
    clearError("phone");
  };

  const validate = (values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    contactMethod: string;
    residences: string;
    assets: string;
  }): Errors => {
    const e: Errors = {};
    if (!values.firstName) e.firstName = dict.form.errors.required;
    if (!values.lastName) e.lastName = dict.form.errors.required;
    if (!values.email) e.email = dict.form.errors.required;
    else if (!EMAIL_RE.test(values.email)) e.email = dict.form.errors.email;
    if (values.phone && !PHONE_RE.test(values.phone))
      e.phone = dict.form.errors.phone;
    if (!values.contactMethod) e.contactMethod = dict.form.errors.select;
    if (!values.residences) e.residences = dict.form.errors.required;
    if (!values.assets) e.assets = dict.form.errors.select;
    return e;
  };

  const focusFirstError = (errs: Errors) => {
    const order: FieldName[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "contactMethod",
      "residences",
      "assets",
      "message",
    ];
    const first = order.find((f) => errs[f]);
    if (!first || !formRef.current) return;
    // For contactMethod/assets (custom SelectField), target the button.
    const el =
      formRef.current.querySelector<HTMLElement>(
        `[name="${first}"], [data-field="${first}"]`,
      ) ?? null;
    el?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const number = phoneNumber.trim();
    const countryCode = phoneCountry.trim();
    const email = String(data.get("email") ?? "").trim();
    const residences = String(data.get("residences") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors = validate({
      firstName,
      lastName,
      email,
      phone: number,
      contactMethod,
      residences,
      assets,
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    const payload = {
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" "),
      email,
      phoneCountryCode: countryCode,
      phoneNumber: number,
      phone: [countryCode, number].filter(Boolean).join(" "),
      contactMethod,
      residences,
      assets,
      message,
      readyForAdvisor,
      preferConversation,
      locale: params?.lang ?? "",
    };

    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      await submitContactForm(payload);
      form.reset();
      setReadyForAdvisor(false);
      setPreferConversation(false);
      setContactMethod("");
      setAssets("");
      setPhoneCountry("");
      setPhoneNumber("");
      setStatus({ kind: "success" });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : dict.form.errors.submitFailed,
      });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-28 md:pt-32 xl:pt-40 pb-24 lg:pb-32 xl:pb-40"
    >  
      <div className="relative z-10 px-5 sm:px-10 xl:px-20">
        <div className="flex flex-col">
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={0}
            duration={1400}
            className="font-raleway font-light text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] leading-[1.5] tracking-[0.1em] text-navy"
          >
            {dict.eyebrow}
          </ScrollReveal>

          <ScrollReveal
            as="h1"
            variant="fade-up"
            delay={100}
            duration={1800}
            className="mt-1 md:mt-2 font-catalog font-normal text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px] xl:text-[48px] leading-[1.5] tracking-[0.1em] text-navy"
          >
            {dict.title}
          </ScrollReveal>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-center lg:justify-start lg:gap-18">
          <div className="mx-auto lg:-ml-10 relative aspect-square w-full max-w-[260px] sm:max-w-[310px] md:max-w-[330px] lg:max-w-[370px] xl:max-w-[500px] shrink-0 z-10">
            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Parallax
                speed={0.06}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/contact/butterfly.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 600px, 90vw"
                  className="object-contain"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="block absolute bottom-[20%] right-[18%] w-1/5 aspect-square pointer-events-none z-10"
            >
              <Parallax
                speed={-0.06}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/home/line-ball.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 100px, 80px"
                  className="object-contain"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-right"
              delay={0}
              duration={1600}
              distance={60}
              className="absolute top-0 right-[-5%] w-[30%] aspect-square rounded-full overflow-hidden"
            >
              <Parallax
                speed={0.05}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/shared/quote-ellipse-large.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 150px, 160px"
                  className="object-cover -rotate-90 opacity-90"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="zoom-in"
              delay={400}
              duration={1600}
              className="absolute bottom-[28%] left-[17%] w-[15%] aspect-square"
            >
              <Parallax
                speed={-0.05}
                data-scroll
                className="relative w-full h-full rounded-full overflow-hidden"
              >
                <Image
                  src="/shared/family-legacy-ellipse.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 128px, 96px"
                  className="object-cover opacity-70"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <ScrollReveal
            variant="fade-up"
            delay={200}
            duration={1600}
            className="relative flex-1 pt-0 lg:pt-9"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 sm:gap-x-4.5 gap-y-5 md:gap-y-6"
            >
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>{dict.form.name}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 sm:gap-x-4.5 gap-y-4">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      name="firstName"
                      placeholder={dict.form.firstNamePlaceholder}
                      aria-invalid={Boolean(errors.firstName)}
                      onInput={() => clearError("firstName")}
                      className={`${INPUT_CLASSES} ${
                        errors.firstName ? ERROR_BORDER_CLASSES : ""
                      }`}
                    />
                    {errors.firstName && (
                      <ErrorText>{errors.firstName}</ErrorText>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      name="lastName"
                      placeholder={dict.form.lastNamePlaceholder}
                      aria-invalid={Boolean(errors.lastName)}
                      onInput={() => clearError("lastName")}
                      className={`${INPUT_CLASSES} ${
                        errors.lastName ? ERROR_BORDER_CLASSES : ""
                      }`}
                    />
                    {errors.lastName && (
                      <ErrorText>{errors.lastName}</ErrorText>
                    )}
                  </div>
                </div>
              </div>
              <Field
                label={dict.form.email}
                name="email"
                type="email"
                placeholder={dict.form.emailPlaceholder}
                error={errors.email}
                onInput={() => clearError("email")}
              />
              <PhoneField
                label={dict.form.phone}
                countryCode={dict.form.phoneCountryCode}
                placeholder={dict.form.phonePlaceholder}
                country={phoneCountry}
                number={phoneNumber}
                onCountryChange={handleCountryChange}
                onNumberChange={handleNumberChange}
                error={errors.phone}
              />
              <SelectField
                label={dict.form.contactMethod}
                name="contactMethod"
                value={contactMethod}
                onChange={(v) => {
                  setContactMethod(v);
                  clearError("contactMethod");
                }}
                placeholder={dict.form.contactMethodPlaceholder}
                options={dict.form.contactMethodOptions}
                error={errors.contactMethod}
              />
              <Field
                label={dict.form.residences}
                name="residences"
                placeholder={dict.form.residencesPlaceholder}
                error={errors.residences}
                onInput={() => clearError("residences")}
              />

              <SelectField
                label={dict.form.assets}
                name="assets"
                value={assets}
                onChange={(v) => {
                  setAssets(v);
                  clearError("assets");
                }}
                placeholder={dict.form.assetsPlaceholder}
                options={dict.form.assetsOptions}
                error={errors.assets}
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2 flex flex-col gap-3 pt-1">
                <CheckboxRow
                  checked={readyForAdvisor}
                  onChange={setReadyForAdvisor}
                  label={dict.form.readyAdvisor}
                />
                <CheckboxRow
                  checked={preferConversation}
                  onChange={setPreferConversation}
                  label={dict.form.preferConversation}
                />
              </div>

              <Field
                label={dict.form.message}
                name="message"
                placeholder={dict.form.messagePlaceholder}
                className="sm:col-span-2"
                onInput={() => clearError("message")}
              />

              <div className="sm:col-span-2 flex flex-col items-start gap-3 mt-1 md:mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center w-[140px] sm:w-[150px] xl:w-[164px] h-[34px] sm:h-[36px] xl:h-[38px] rounded-[15px] border border-gold text-gold font-saira text-[13px] sm:text-[14px] xl:text-[16px] hover:bg-gold hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "…" : dict.form.submit}
                </button>
                {status.kind === "error" && (
                  <p
                    role="alert"
                    className="font-raleway text-[12px] sm:text-[13px] text-red-600"
                  >
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="absolute bottom-0 overflow-hidden w-full h-40 md:h-60 lg:h-70 xl:h-80 -mt-20 md:-mt-28 lg:-mt-30 pointer-events-none"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="relative w-full h-full -bottom-8"
        >
          <Image
            src="/journals/blue-wave-sand.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover object-top"
          />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white to-transparent" />
      </ScrollReveal>
      {status.kind === "success" && (
        <Toast
          message={dict.form.errors.successMessage}
          onClose={() => setStatus({ kind: "idle" })}
        />
      )}
    </section>
  );
}

function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 xl:top-28 right-6 z-50 bg-gold text-white px-5 py-3 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.18)] font-raleway text-[13px] sm:text-[14px] leading-[1.2] max-w-xs animate-toast-in"
    >
      {message}
    </div>
  );
}

const LABEL_CLASSES =
  "font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] leading-[1.2] tracking-normal text-gold";

const INPUT_BASE_CLASSES =
  "w-full bg-transparent border-b border-[#424242]/40 focus:border-[#424242] outline-none py-1.5";

const INPUT_VALUE_CLASSES =
  "font-raleway text-[12px] sm:text-[13px] md:text-[14px] leading-[1.2] text-navy";

const INPUT_PLACEHOLDER_CLASSES =
  "font-catalog font-normal text-[10px] sm:text-[11px] md:text-[12px] leading-[1.2] tracking-normal text-[#B3B3B3]";

const INPUT_PLACEHOLDER_VARIANT_CLASSES =
  "placeholder:font-catalog placeholder:font-normal placeholder:text-[10px] sm:placeholder:text-[11px] md:placeholder:text-[12px] placeholder:leading-[1.2] placeholder:tracking-normal placeholder:text-[#B3B3B3]";

const INPUT_CLASSES = `${INPUT_BASE_CLASSES} ${INPUT_VALUE_CLASSES} ${INPUT_PLACEHOLDER_VARIANT_CLASSES}`;

const ERROR_BORDER_CLASSES =
  "!border-red-500 focus:!border-red-500 focus-within:!border-red-500";

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="alert"
      className="font-raleway text-[10px] sm:text-[11px] md:text-[12px] leading-[1.2] text-red-600"
    >
      {children}
    </span>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  onInput?: () => void;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  className,
  error,
  onInput,
}: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className={LABEL_CLASSES}>{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onInput={onInput}
        className={`${INPUT_CLASSES} ${error ? ERROR_BORDER_CLASSES : ""}`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

type PhoneFieldProps = {
  label: string;
  countryCode: string;
  placeholder?: string;
  country: string;
  number: string;
  onCountryChange: (raw: string) => void;
  onNumberChange: (raw: string) => void;
  className?: string;
  error?: string;
};

function PhoneField({
  label,
  countryCode,
  placeholder,
  country,
  number,
  onCountryChange,
  onNumberChange,
  className,
  error,
}: PhoneFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className={LABEL_CLASSES}>{label}</span>
      <div className="w-full flex items-center gap-3 sm:gap-4">
        <input
          type="text"
          name="phoneCountryCode"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder={countryCode}
          inputMode="numeric"
          autoComplete="tel-country-code"
          maxLength={5}
          className={`${INPUT_CLASSES} shrink-0 w-12 sm:w-14 text-center`}
        />
        <input
          type="tel"
          name="phone"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={Boolean(error)}
          className={`${INPUT_CLASSES} flex-1 min-w-0 ${
            error ? ERROR_BORDER_CLASSES : ""
          }`}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
};

function SelectField({
  label,
  name,
  placeholder,
  options,
  value,
  onChange,
  className,
  error,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlaceholder = value === "";

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className={LABEL_CLASSES}>{label}</span>
      <div ref={containerRef} className="relative">
        <input type="hidden" name={name} value={value} />
        <button
          type="button"
          data-field={name}
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`${INPUT_BASE_CLASSES} appearance-none pr-8 cursor-pointer text-left ${
            isPlaceholder ? INPUT_PLACEHOLDER_CLASSES : INPUT_VALUE_CLASSES
          } ${error ? ERROR_BORDER_CLASSES : ""}`}
        >
          {isPlaceholder ? placeholder : value}
        </button>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#424242]/70 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-navy/10 overflow-hidden max-h-80 overflow-y-auto"
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 font-raleway text-[12px] sm:text-[13px] md:text-[14px] leading-[1.2] text-navy transition-colors hover:bg-navy/5 ${
                      selected ? "bg-navy/5" : ""
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  className?: string;
};

function TextareaField({
  label,
  name,
  rows = 2,
  placeholder,
  className,
}: TextareaFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className={LABEL_CLASSES}>{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`${INPUT_CLASSES} resize-none`}
      />
    </label>
  );
}

type CheckboxRowProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

function CheckboxRow({ checked, onChange, label }: CheckboxRowProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center border transition-colors ${
          checked ? "bg-gold border-gold" : "border-[#424242] opacity-40"
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
      </span>
      <span className="font-raleway font-normal text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] xl:text-[16px] leading-[1.2] tracking-normal text-gold">
        {label}
      </span>
    </label>
  );
}
