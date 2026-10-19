"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { finalCtaCopy } from "@/content/final-cta";
import { joinWaitlist } from "@/lib/waitlist/actions";
import {
  PLATFORM_LABELS,
  PLATFORMS,
  type WaitlistFormValues,
  waitlistFormSchema,
} from "@/lib/waitlist/schema";

export function WaitlistForm({ siteKey }: { siteKey: string | null }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [nearViewport, setNearViewport] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [widgetFailed, setWidgetFailed] = useState(false);
  const [widgetNonce, setWidgetNonce] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const widgetRef = useRef<TurnstileInstance | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { email: "", platform: undefined, company: "" },
  });

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (successEmail) {
      successHeadingRef.current?.focus();
    }
  }, [successEmail]);

  function resetWidget() {
    widgetRef.current?.reset();
    setToken(null);
  }

  function remountWidget() {
    setWidgetFailed(false);
    setToken(null);
    setWidgetNonce((value) => value + 1);
  }

  function onSubmit(values: WaitlistFormValues) {
    setFormError(null);
    if (!siteKey) {
      setFormError(finalCtaCopy.errors.unavailable);
      return;
    }
    if (!token) {
      setFormError(finalCtaCopy.errors.captcha);
      return;
    }

    startTransition(async () => {
      try {
        const result = await joinWaitlist({
          ...values,
          turnstileToken: token,
        });
        resetWidget();
        if (result.status === "success") {
          setSuccessEmail(values.email);
          return;
        }
        if (result.fieldErrors?.email) {
          form.setError("email", { message: result.fieldErrors.email });
        }
        if (result.fieldErrors?.platform) {
          form.setError("platform", { message: result.fieldErrors.platform });
        }
        if (result.code !== "validation") {
          setFormError(result.message);
        }
      } catch {
        resetWidget();
        setFormError(finalCtaCopy.errors.network);
      }
    });
  }

  if (successEmail) {
    return (
      <div className="space-y-4" aria-live="polite">
        <CircleCheck className="size-10 text-success" aria-hidden />
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-h3 outline-none"
        >
          {finalCtaCopy.success.heading}
        </h3>
        <p className="text-sm text-muted-foreground">
          {finalCtaCopy.success.textBefore}
          <strong>{successEmail}</strong>
          {finalCtaCopy.success.textAfter}
        </p>
        <Button className="h-11 w-full" asChild>
          <Link href="/dashboard">{finalCtaCopy.success.demoCta}</Link>
        </Button>
        <Button
          variant="ghost"
          className="h-11 w-full"
          type="button"
          onClick={() => {
            setSuccessEmail(null);
            form.reset();
            setFormError(null);
            remountWidget();
          }}
        >
          {finalCtaCopy.success.reset}
        </Button>
      </div>
    );
  }

  const emailError = form.formState.errors.email?.message;
  const platformError = form.formState.errors.platform?.message;
  const showWidget = Boolean(siteKey) && nearViewport;

  return (
    <div ref={rootRef}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
        noValidate
      >
        <div
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
          aria-hidden
        >
          <label htmlFor="company">{finalCtaCopy.form.honeypotLabel}</label>
          <input
            id="company"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        <FieldGroup>
          <Field data-invalid={emailError ? true : undefined}>
            <FieldLabel htmlFor="email">
              {finalCtaCopy.form.emailLabel}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={finalCtaCopy.form.emailPlaceholder}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              {...form.register("email")}
            />
            <FieldError id="email-error">{emailError}</FieldError>
          </Field>

          <Field data-invalid={platformError ? true : undefined}>
            <FieldLabel htmlFor="platform">
              {finalCtaCopy.form.platformLabel}
            </FieldLabel>
            <Controller
              control={form.control}
              name="platform"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as WaitlistFormValues["platform"])
                  }
                >
                  <SelectTrigger
                    id="platform"
                    className="h-11 w-full"
                    aria-invalid={platformError ? true : undefined}
                    aria-describedby={
                      platformError ? "platform-error" : undefined
                    }
                  >
                    <SelectValue
                      placeholder={finalCtaCopy.form.platformPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {PLATFORM_LABELS[platform]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="platform-error">{platformError}</FieldError>
          </Field>
        </FieldGroup>

        {siteKey === null ? (
          <div role="alert" className="text-sm text-destructive">
            {finalCtaCopy.errors.unavailable}
          </div>
        ) : null}

        {formError ? (
          <div role="alert" className="text-sm text-destructive">
            {formError}
          </div>
        ) : null}

        {showWidget ? (
          <div className="min-h-[65px]">
            {widgetFailed ? (
              <p className="text-sm">
                {finalCtaCopy.form.widgetFailed}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={remountWidget}
                >
                  {finalCtaCopy.form.tryAgain}
                </button>
                .
              </p>
            ) : (
              <Turnstile
                key={widgetNonce}
                ref={widgetRef}
                siteKey={siteKey!}
                options={{
                  action: "waitlist",
                  theme:
                    mounted && resolvedTheme === "dark"
                      ? "dark"
                      : mounted && resolvedTheme === "light"
                        ? "light"
                        : "auto",
                  size: "flexible",
                }}
                scriptOptions={{
                  onError: () => setWidgetFailed(true),
                }}
                onSuccess={(value) => {
                  setToken(value);
                  setWidgetFailed(false);
                }}
                onExpire={() => setToken(null)}
                onError={() => setToken(null)}
              />
            )}
          </div>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={pending || !token || !siteKey}
        >
          {pending ? (
            <>
              <Spinner />
              {finalCtaCopy.form.submitting}
            </>
          ) : (
            finalCtaCopy.form.submit
          )}
        </Button>
        {!token && siteKey && nearViewport && !widgetFailed ? (
          <p className="text-xs text-muted-foreground">
            {finalCtaCopy.form.verifying}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {finalCtaCopy.form.consentBefore}
          <Link href="/privacy" className="underline underline-offset-2">
            {finalCtaCopy.form.consentLink}
          </Link>
          {finalCtaCopy.form.consentAfter}
        </p>
      </form>
    </div>
  );
}
