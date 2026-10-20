import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/sanity/lib/locale";
import type { ContactFormProps } from "@/lib/contact";

// Every label and validation message is translated here rather than in the CMS:
// the form is template-owned chrome, and `satisfies Record<Locale, unknown>`
// makes TypeScript demand a set for each locale in `LOCALES`.
const translations = {
  en: {
    name: "Name",
    namePlaceholder: "Jane Doe",
    email: "Email",
    emailPlaceholder: "jane@example.com",
    subject: "Subject",
    subjectPlaceholder: "What is this about?",
    message: "Message",
    messagePlaceholder: "Tell me a bit about what you have in mind…",
    send: "Send message",
    sending: "Sending…",
    sendAnother: "Send another message",
    successTitle: "Thanks — your message is on its way.",
    successBody: "I'll get back to you at the address you provided.",
    errors: {
      name: "Please enter your name (at least 2 characters).",
      nameLong: "That name is a bit too long.",
      email: "Please enter a valid email address.",
      subject: "Please add a short subject (at least 3 characters).",
      subjectLong: "Please keep the subject under 120 characters.",
      message: "Please write at least 10 characters.",
      messageLong: "Please keep the message under 2000 characters.",
      submit: "Something went wrong sending your message. Please try again.",
      config: "The contact form is not configured yet. Please try again later.",
    },
  },
  nb: {
    name: "Navn",
    namePlaceholder: "Ola Nordmann",
    email: "E-post",
    emailPlaceholder: "ola@eksempel.no",
    subject: "Emne",
    subjectPlaceholder: "Hva gjelder det?",
    message: "Melding",
    messagePlaceholder: "Fortell litt om hva du tenker på…",
    send: "Send melding",
    sending: "Sender…",
    sendAnother: "Send en ny melding",
    successTitle: "Takk — meldingen er sendt.",
    successBody: "Jeg tar kontakt på e-postadressen du oppga.",
    errors: {
      name: "Skriv inn navnet ditt (minst 2 tegn).",
      nameLong: "Navnet er litt for langt.",
      email: "Skriv inn en gyldig e-postadresse.",
      subject: "Legg til et kort emne (minst 3 tegn).",
      subjectLong: "Hold emnet under 120 tegn.",
      message: "Skriv minst 10 tegn.",
      messageLong: "Hold meldingen under 2000 tegn.",
      submit: "Noe gikk galt under sendingen. Prøv igjen.",
      config: "Kontaktskjemaet er ikke satt opp ennå. Prøv igjen senere.",
    },
  },
} satisfies Record<Locale, unknown>;

type Translation = (typeof translations)["en"];

// Zod schema is built per locale so validation messages follow the page language
const buildContactSchema = (t: Translation) =>
  z.object({
    name: z.string().trim().min(2, t.errors.name).max(80, t.errors.nameLong),
    email: z.email(t.errors.email),
    subject: z
      .string()
      .trim()
      .min(3, t.errors.subject)
      .max(120, t.errors.subjectLong),
    message: z
      .string()
      .trim()
      .min(10, t.errors.message)
      .max(2000, t.errors.messageLong),
    // Honeypot: humans leave it empty, bots tend to fill it in.
    // Formspree drops submissions where _gotcha has a value.
    _gotcha: z.string().max(0),
  });

// Standard Schema errors arrive as issue objects; older/manual validators as strings
const errorMessages = (errors: unknown[]) =>
  errors
    .map((error) =>
      typeof error === "string"
        ? error
        : (error as { message?: string } | null)?.message,
    )
    .filter((message): message is string => Boolean(message));

const ContactForm = ({
  endpoint,
  locale = "en",
  className,
  overrides,
  onSuccess,
}: ContactFormProps) => {
  const t = translations[locale] ?? translations.en;
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const schema = useMemo(() => buildContactSchema(t), [t]);

  // Editors can rewrite the visible wording from the Studio (the `contactForm`
  // block on the contact page document). Anything left empty keeps the
  // built-in localized default above, and the validation messages always come
  // from `t` because they are tied to the Zod rules.
  const strings = useMemo(
    () => ({
      ...t,
      send: overrides?.submitLabel?.trim() || t.send,
      successTitle: overrides?.successTitle?.trim() || t.successTitle,
      successBody: overrides?.successBody?.trim() || t.successBody,
    }),
    [t, overrides],
  );
  const heading = overrides?.heading?.trim();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      _gotcha: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null);

      if (!endpoint) {
        setSubmitError(t.errors.config);
        return;
      }

      // A filled honeypot means a bot: pretend it worked, send nothing.
      if (value._gotcha) {
        setSucceeded(true);
        return;
      }

      // onSubmit receives the raw input values, so run them back through the
      // schema to get the trimmed output before sending anything to Formspree.
      const parsed = schema.safeParse(value);
      if (!parsed.success) {
        setSubmitError(t.errors.submit);
        return;
      }
      const data = parsed.data;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            // Formspree conveniences: readable email subject + reply-to address
            _subject: `${data.subject} — ${data.name}`,
            _replyto: data.email,
            locale,
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          const detail: string | undefined =
            body?.errors?.[0]?.message ?? body?.error;
          throw new Error(detail ?? t.errors.submit);
        }

        formApi.reset();
        setSubmitAttempted(false);
        setSucceeded(true);
        onSuccess?.();
      } catch (error) {
        setSubmitError(
          error instanceof Error && error.message
            ? error.message
            : t.errors.submit,
        );
      }
    },
  });

  if (succeeded) {
    return (
      <div className={cn("flex flex-col gap-4 py-4", className)}>
        {heading && (
          <h2 className="font-heading text-xl font-semibold">{heading}</h2>
        )}
        <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-card p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{strings.successTitle}</p>
            <p className="text-sm text-muted-foreground">
              {strings.successBody}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSucceeded(false);
            setSubmitError(null);
          }}
        >
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitAttempted(true);
        void form.handleSubmit();
      }}
    >
      {heading && (
        <h2 className="font-heading text-xl font-semibold">{heading}</h2>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            const showError =
              messages.length > 0 &&
              (field.state.meta.isTouched || submitAttempted);
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{t.name}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="name"
                  placeholder={t.namePlaceholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={showError}
                  aria-describedby={showError ? `${field.name}-error` : undefined}
                />
                {showError && (
                  <p id={`${field.name}-error`} className="text-sm text-destructive">
                    {messages[0]}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            const showError =
              messages.length > 0 &&
              (field.state.meta.isTouched || submitAttempted);
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{t.email}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={showError}
                  aria-describedby={showError ? `${field.name}-error` : undefined}
                />
                {showError && (
                  <p id={`${field.name}-error`} className="text-sm text-destructive">
                    {messages[0]}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="subject">
        {(field) => {
          const messages = errorMessages(field.state.meta.errors);
          const showError =
            messages.length > 0 &&
            (field.state.meta.isTouched || submitAttempted);
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>{t.subject}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t.subjectPlaceholder}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={showError}
                aria-describedby={showError ? `${field.name}-error` : undefined}
              />
              {showError && (
                <p id={`${field.name}-error`} className="text-sm text-destructive">
                  {messages[0]}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="message">
        {(field) => {
          const messages = errorMessages(field.state.meta.errors);
          const showError =
            messages.length > 0 &&
            (field.state.meta.isTouched || submitAttempted);
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>{t.message}</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={6}
                placeholder={t.messagePlaceholder}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={showError}
                aria-describedby={showError ? `${field.name}-error` : undefined}
              />
              {showError && (
                <p id={`${field.name}-error`} className="text-sm text-destructive">
                  {messages[0]}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Honeypot — hidden from people, tempting to bots */}
      <form.Field name="_gotcha">
        {(field) => (
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            name={field.name}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:self-start"
          >
            <Send className="size-4" />
            {isSubmitting ? t.sending : strings.send}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

export { ContactForm };
