import { useId, useState } from "react";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Field, FieldError, FieldLabel, FieldGroup } from "../components/field";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { PasswordInput } from "../components/password-input";
import { AuthHeading } from "../shell/auth/auth-heading";
import { notify } from "../toast";

type LoginFormProps = Readonly<{
  /** Resolves with an error message, or nothing when sign-in worked. */
  onSignIn?: (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<string | void>;
  /** Show the "Create an account" line. Off when sign-up is by invitation only. */
  showSignUp?: boolean;
}>;

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);

/**
 * The sign-in form pattern: heading, email, password with "Forgot password?", remember me, submit.
 * Validates on submit, keeps the button disabled while saving, and announces errors.
 * (A simple version of the template form: no form library, no real sign-in.)
 */
export function LoginForm({
  onSignIn = async ({ password }) => {
    await new Promise((r) => setTimeout(r, 800));
    if (password === "wrong") return "That email and password do not match.";
  },
  showSignUp = true,
}: LoginFormProps) {
  const id = useId();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [saving, setSaving] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <AuthHeading
        title="Welcome back"
        description={
          <>
            Sign in to manage your content.
            {showSignUp && (
              <>
                {" "}
                New here?{" "}
                <a href="#" className="text-primary underline-offset-4 hover:underline">
                  Create an account
                </a>
                .
              </>
            )}
          </>
        }
      />
      <form
        noValidate
        className="grid gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = String(data.get("email") ?? "").trim();
          const password = String(data.get("password") ?? "");
          const next = {
            email: emailOk(email) ? undefined : "Enter a valid email address.",
            password: password ? undefined : "Enter your password.",
          };
          setErrors(next);
          if (next.email || next.password) return;
          setSaving(true);
          const error = await onSignIn({
            email,
            password,
            remember: data.get("remember") === "on",
          });
          setSaving(false);
          if (error) setErrors({ password: error });
          else notify.success("Signed in");
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${id}-email-err` : undefined}
            />
            {errors.email && <FieldError id={`${id}-email-err`} errors={[errors.email]} />}
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
              <a href="#" className="text-primary text-sm underline-offset-4 hover:underline">
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id={`${id}-password`}
              name="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? `${id}-pw-err` : undefined}
            />
            {errors.password && <FieldError id={`${id}-pw-err`} errors={[errors.password]} />}
          </Field>
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} name="remember" defaultChecked />
            <Label htmlFor={`${id}-remember`}>Keep me signed in</Label>
          </div>
        </FieldGroup>
        <Button type="submit" size="lg" loading={saving}>
          {saving ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
