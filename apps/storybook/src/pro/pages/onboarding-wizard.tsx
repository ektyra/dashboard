import { useState } from "react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { RadioCard } from "../../components/choice-card";
import { Field, FieldDescription, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { RadioGroup } from "../../components/radio-group";
import { Stepper } from "../../components/stepper";
import { TagsInput } from "../../components/tags-input";
import { Switch } from "../../components/switch";
import { Label } from "../../components/label";
import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import { notify } from "../../toast";

const steps = [
  { title: "Workspace", description: "Name and type" },
  { title: "Team", description: "Invite people" },
  { title: "Preferences", description: "Notifications" },
  { title: "Done" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [emails, setEmails] = useState<string[]>([]);
  const last = step === steps.length - 1;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-6">
      <Stepper steps={steps} current={step} onStepClick={(i) => i < step && setStep(i)} />
      <Card>
        <CardContent className="grid gap-6 p-6">
          {step === 0 && (
            <>
              <div>
                <Heading level={2} size="xl">
                  Set up your workspace
                </Heading>
                <Text variant="muted">You can change all of this later.</Text>
              </div>
              <Field>
                <FieldLabel htmlFor="ob-name">Workspace name</FieldLabel>
                <Input id="ob-name" defaultValue="Acme" />
              </Field>
              <RadioGroup defaultValue="agency" className="gap-3" aria-label="Workspace type">
                <RadioCard
                  value="agency"
                  title="Agency"
                  description="I build dashboards for clients"
                />
                <RadioCard
                  value="company"
                  title="Company"
                  description="One dashboard for my own team"
                />
              </RadioGroup>
            </>
          )}
          {step === 1 && (
            <>
              <div>
                <Heading level={2} size="xl">
                  Invite your team
                </Heading>
                <Text variant="muted">Type an email and press Enter. You can skip this.</Text>
              </div>
              <Field>
                <FieldLabel htmlFor="ob-emails">Email addresses</FieldLabel>
                <TagsInput
                  id="ob-emails"
                  value={emails}
                  onChange={setEmails}
                  placeholder="name@example.com"
                  aria-label="Email addresses"
                />
                <FieldDescription>They get an invitation as soon as you finish.</FieldDescription>
              </Field>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <Heading level={2} size="xl">
                  How should we reach you?
                </Heading>
              </div>
              {["Weekly summary", "Mentions", "Product news"].map((l, i) => (
                <div key={l} className="flex items-center justify-between">
                  <Label htmlFor={`ob-n${i}`}>{l}</Label>
                  <Switch id={`ob-n${i}`} defaultChecked={i < 2} />
                </div>
              ))}
            </>
          )}
          {last && (
            <div className="grid gap-2 py-6 text-center">
              <Heading level={2} size="xl">
                You are all set
              </Heading>
              <Text variant="muted">
                Your workspace is ready
                {emails.length
                  ? ` and ${emails.length} invitation${emails.length > 1 ? "s" : ""} will be sent`
                  : ""}
                .
              </Text>
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button
              onClick={() => {
                if (last) {
                  notify.success("Welcome aboard");
                  setStep(0);
                } else setStep((s) => s + 1);
              }}
            >
              {last ? "Open dashboard" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
