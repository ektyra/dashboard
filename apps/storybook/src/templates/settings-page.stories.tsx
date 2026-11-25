import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Field, FieldDescription, FieldLabel } from "../components/field";
import { FormSection } from "../components/form-section";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { NativeSelect } from "../components/native-select";
import { Switch } from "../components/switch";
import { ConfirmDialog } from "../patterns/confirm-dialog";
import { PageHeader } from "../shell/page-header";
import { notify } from "../toast";
import { AppFrame } from "./app-frame";

const meta = {
  title: "Templates/SettingsPage",
  parameters: { layout: "fullscreen", initialPath: "/settings" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const sections = ["Profile", "Notifications", "Danger zone"];

function Page() {
  const [dirty, setDirty] = useState(false);
  const change = () => setDirty(true);
  return (
    <AppFrame>
      <PageHeader title="Settings" subtitle="Your profile and how we contact you." />
      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex gap-1 lg:flex-col">
          {sections.map((s, i) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(" ", "-")}`}
              aria-current={i === 0 ? "true" : undefined}
              className="text-muted-foreground hover:bg-muted hover:text-foreground aria-[current]:bg-accent aria-[current]:text-accent-foreground rounded-md px-3 py-2 text-sm"
            >
              {s}
            </a>
          ))}
        </nav>
        <div className="flex max-w-2xl flex-col gap-8">
          <Card id="profile">
            <CardContent className="p-6">
              <FormSection title="Profile" description="How you appear to your team.">
                <div className="grid gap-4">
                  <Field>
                    <FieldLabel htmlFor="s-name">Name</FieldLabel>
                    <Input id="s-name" defaultValue="Ada Lovelace" onChange={change} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="s-lang">Language</FieldLabel>
                    <NativeSelect id="s-lang" defaultValue="en" onChange={change}>
                      <option value="en">English</option>
                      <option value="nl">Nederlands</option>
                    </NativeSelect>
                    <FieldDescription>Used for dates, numbers and emails.</FieldDescription>
                  </Field>
                </div>
              </FormSection>
            </CardContent>
          </Card>
          <Card id="notifications">
            <CardContent className="p-6">
              <FormSection title="Notifications" description="Choose what reaches your inbox.">
                <div className="grid gap-4">
                  {[
                    ["Weekly summary", "A digest of what changed."],
                    ["Mentions", "When someone mentions you."],
                    ["Product news", "New features, once a month."],
                  ].map(([label, hint], i) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <div className="grid gap-0.5">
                        <Label htmlFor={`n-${i}`}>{label}</Label>
                        <span className="text-muted-foreground text-xs">{hint}</span>
                      </div>
                      <Switch id={`n-${i}`} defaultChecked={i < 2} onCheckedChange={change} />
                    </div>
                  ))}
                </div>
              </FormSection>
            </CardContent>
          </Card>
          <Card id="danger-zone" className="border-destructive/40">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-muted-foreground text-sm">
                  Removes your profile and access. This cannot be undone.
                </p>
              </div>
              <ConfirmDialog
                trigger={<Button variant="destructive">Delete account</Button>}
                title="Delete your account?"
                description="Your profile, 3 projects and all personal settings will be removed for good."
                confirmLabel="Delete account"
                destructive
                onConfirm={() => notify.error("Account deleted (demo)")}
              />
            </CardContent>
          </Card>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" disabled={!dirty} onClick={() => setDirty(false)}>
              Discard
            </Button>
            <Button
              disabled={!dirty}
              onClick={() => {
                notify.success("Settings saved");
                setDirty(false);
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export const Default: Story = { render: () => <Page /> };
