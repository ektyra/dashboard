import { useEffect, useId, useState } from "react";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { OtpInput } from "../components/otp-input";
import { PasswordInput } from "../components/password-input";
import { AuthHeading } from "../shell/auth/auth-heading";
import { notify } from "../toast";
import { PasswordStrength } from "./password-strength";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);

type Errors = Record<string, string | undefined>;

function useSubmit(
  validate: (data: FormData) => Errors,
  run: (data: FormData) => Promise<Errors | void>,
) {
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validate(data);
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setSaving(true);
    const result = await run(data);
    setSaving(false);
    if (result) setErrors(result);
  };
  return { errors, saving, onSubmit };
}

function TextField({
  id,
  name,
  label,
  type = "text",
  error,
  autoComplete,
  password = false,
  onChange,
  hint,
}: Readonly<{
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  password?: boolean;
  onChange?: (value: string) => void;
  hint?: React.ReactNode;
}>) {
  const Control = password ? PasswordInput : Input;
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Control
        id={id}
        name={name}
        type={password ? undefined : type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      {hint}
      {error && <FieldError id={`${id}-err`} errors={[error]} />}
    </Field>
  );
}

export function RegisterForm() {
  const id = useId();
  const [password, setPassword] = useState("");
  const { errors, saving, onSubmit } = useSubmit(
    (d) => ({
      name: String(d.get("name") ?? "").trim() ? undefined : "Enter your name.",
      email: emailOk(String(d.get("email") ?? "")) ? undefined : "Enter a valid email address.",
      password:
        String(d.get("password") ?? "").length >= 8 ? undefined : "Use at least 8 characters.",
      terms: d.get("terms") ? undefined : "Accept the terms to continue.",
    }),
    async () => {
      await wait(800);
      notify.success("Account created");
    },
  );
  return (
    <div className="flex w-full flex-col gap-8">
      <AuthHeading
        title="Create your account"
        description={
          <>
            Already have one?{" "}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </a>
            .
          </>
        }
      />
      <form noValidate className="grid gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          <TextField
            id={`${id}-name`}
            name="name"
            label="Name"
            autoComplete="name"
            error={errors.name}
          />
          <TextField
            id={`${id}-email`}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <TextField
            id={`${id}-pw`}
            name="password"
            label="Password"
            password
            autoComplete="new-password"
            error={errors.password}
            onChange={setPassword}
            hint={<PasswordStrength password={password} />}
          />
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-terms`} name="terms" aria-invalid={Boolean(errors.terms)} />
              <Label htmlFor={`${id}-terms`}>I accept the terms and privacy policy</Label>
            </div>
            {errors.terms && <FieldError errors={[errors.terms]} />}
          </div>
        </FieldGroup>
        <Button type="submit" size="lg" loading={saving}>
          {saving ? "Creating account" : "Create account"}
        </Button>
      </form>
    </div>
  );
}

export function ForgotPasswordForm() {
  const id = useId();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { errors, saving, onSubmit } = useSubmit(
    (d) => ({
      email: emailOk(String(d.get("email") ?? "")) ? undefined : "Enter a valid email address.",
    }),
    async (d) => {
      await wait(800);
      setSentTo(String(d.get("email")));
    },
  );
  if (sentTo) {
    return (
      <div className="flex w-full flex-col gap-8">
        <AuthHeading
          icon={<MailCheck />}
          title="Check your email"
          description={
            <>
              We sent a reset link to <strong className="text-foreground">{sentTo}</strong>. It
              works for 30 minutes.
            </>
          }
        />
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={() => setSentTo(null)}>
            Use another email
          </Button>
          <a
            href="#"
            className="text-primary inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-8">
      <AuthHeading
        title="Forgot your password?"
        description="Enter your email and we will send you a link to choose a new one."
      />
      <form noValidate className="grid gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          <TextField
            id={`${id}-email`}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
        </FieldGroup>
        <Button type="submit" size="lg" loading={saving}>
          {saving ? "Sending" : "Send reset link"}
        </Button>
        <a
          href="#"
          className="text-primary inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
        </a>
      </form>
    </div>
  );
}

export function ResetPasswordForm() {
  const id = useId();
  const [password, setPassword] = useState("");
  const { errors, saving, onSubmit } = useSubmit(
    (d) => {
      const pw = String(d.get("password") ?? "");
      return {
        password: pw.length >= 8 ? undefined : "Use at least 8 characters.",
        confirm: d.get("confirm") === pw ? undefined : "The passwords do not match.",
      };
    },
    async () => {
      await wait(800);
      notify.success("Password changed");
    },
  );
  return (
    <div className="flex w-full flex-col gap-8">
      <AuthHeading
        title="Choose a new password"
        description="Pick something you do not use anywhere else."
      />
      <form noValidate className="grid gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          <TextField
            id={`${id}-pw`}
            name="password"
            label="New password"
            password
            autoComplete="new-password"
            error={errors.password}
            onChange={setPassword}
            hint={<PasswordStrength password={password} />}
          />
          <TextField
            id={`${id}-confirm`}
            name="confirm"
            label="Confirm password"
            password
            autoComplete="new-password"
            error={errors.confirm}
          />
        </FieldGroup>
        <Button type="submit" size="lg" loading={saving}>
          {saving ? "Saving" : "Change password"}
        </Button>
      </form>
    </div>
  );
}

const RESEND_SECONDS = 30;

export function TwoStepForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthHeading
        icon={<ShieldCheck />}
        title="Two-step verification"
        description="Enter the 6-digit code from your authenticator app. Demo: the right code is 123456."
      />
      <form
        noValidate
        className="grid gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!/^\d{6}$/.test(code)) {
            setError("Enter all 6 digits.");
            return;
          }
          setSaving(true);
          await wait(800);
          setSaving(false);
          if (code !== "123456") setError("That code is not right. Try again.");
          else {
            setError(undefined);
            notify.success("Verified");
          }
        }}
      >
        <Field>
          <OtpInput
            label="Verification code"
            value={code}
            onChange={(v) => {
              setCode(v);
              setError(undefined);
            }}
            invalid={Boolean(error)}
          />
          {error && <FieldError errors={[error]} />}
        </Field>
        <Button type="submit" size="lg" loading={saving}>
          {saving ? "Checking" : "Verify"}
        </Button>
        <div className="flex items-center justify-between text-sm">
          <a
            href="#"
            className="text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
          </a>
          <button
            type="button"
            disabled={seconds > 0}
            onClick={() => {
              setSeconds(RESEND_SECONDS);
              notify.success("New code sent");
            }}
            className="text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
