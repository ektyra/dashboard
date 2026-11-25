import { useId, useState } from "react";
import { Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { Download, Pencil, Plus, RotateCcw, Save } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import { Switch } from "../../components/switch";
import { Textarea } from "../../components/textarea";
import { cn } from "../../lib/cn";
import { notify } from "../../toast";
import { primaryActionClass } from "./commerce-ui";
import {
  categoriesStore,
  categoryAttributesStore,
  nextConfigId,
  paymentMethodsStore,
  productAttributesStore,
  shippingMethodsStore,
  splitList,
  storePreferences,
  withRecord,
} from "./config";
import type { Attribute, Method } from "./config";
import { downloadFile } from "../../lib/download-file";
import { formatPrice } from "./store";
import { getStoreSection, storeSections } from "./store-settings-data";
import type { StoreField } from "./store-settings-data";

export function StoreSettingsPage({ section }: Readonly<{ section: string }>) {
  return <StoreSettingsSection key={section} section={section} />;
}

function StoreSettingsSection({ section }: Readonly<{ section: string }>) {
  const current = getStoreSection(section);
  const navigate = useNavigate();
  const formId = useId();
  const [dirty, setDirty] = useState(false);
  const [revision, setRevision] = useState(0);
  const editor = { formId, dirty, onDirtyChange: setDirty };
  useBlocker({
    shouldBlockFn: () => dirty && !window.confirm("Discard unsaved store settings changes?"),
    enableBeforeUnload: dirty,
  });
  if (!current) return null;

  return (
    <>
      <PageHeader
        title="Store settings"
        current={current.label}
        subtitle="Configure the demo catalog and checkout. Changes reset on reload."
        actions={
          <>
            <Button
              variant="outline"
              disabled={!dirty}
              onClick={() => {
                setDirty(false);
                setRevision((current) => current + 1);
              }}
            >
              <RotateCcw aria-hidden="true" />
              Reset changes
            </Button>
            <Button type="submit" form={formId} className={primaryActionClass} disabled={!dirty}>
              <Save aria-hidden="true" />
              Save changes
            </Button>
          </>
        }
      />
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label="Store settings sections" className="hidden lg:grid lg:gap-1">
          {storeSections.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              to="/apps/ecommerce/settings/$section"
              params={{ section: id }}
              aria-current={id === section ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                id === section &&
                  "bg-secondary font-medium text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="lg:hidden">
          <NativeSelect
            aria-label="Store settings section"
            value={section}
            onChange={(event) =>
              void navigate({
                to: "/apps/ecommerce/settings/$section",
                params: { section: event.target.value },
              })
            }
          >
            {storeSections.map(({ id, label }) => (
              <option value={id} key={id}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <section aria-labelledby="store-section-heading" className="grid min-w-0 gap-4">
          <div>
            <h2 id="store-section-heading" className="text-xl font-semibold tracking-tight">
              {current.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{current.description}</p>
          </div>
          {section === "product-attributes" && (
            <AttributeSettings key={revision} {...editor} store={productAttributesStore} />
          )}
          {section === "category-attributes" && (
            <AttributeSettings key={revision} {...editor} store={categoryAttributesStore} />
          )}
          {section === "payments" && (
            <MethodSettings key={revision} {...editor} store={paymentMethodsStore} />
          )}
          {section === "shipping" && (
            <MethodSettings key={revision} {...editor} store={shippingMethodsStore} shipping />
          )}
          {current.fields && (
            <PreferencesForm
              key={revision}
              {...editor}
              fields={current.fields}
              backup={section === "backups"}
            />
          )}
        </section>
      </div>
    </>
  );
}

function fieldText(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

type SettingsEditor = Readonly<{
  formId: string;
  dirty: boolean;
  onDirtyChange: (dirty: boolean) => void;
}>;

function PreferencesForm({
  fields,
  backup,
  formId,
  onDirtyChange,
}: SettingsEditor & Readonly<{ fields: readonly StoreField[]; backup: boolean }>) {
  const base = useId();
  const saved = storePreferences.use();
  const read = (form: HTMLFormElement) => {
    const data = new FormData(form);
    return Object.fromEntries(
      fields.map(({ key, type }) => [
        key,
        type === "switch" ? data.has(key) : fieldText(data, key),
      ]),
    );
  };
  return (
    <Card className="shadow-none">
      <CardContent>
        <form
          id={formId}
          className="grid max-w-lg gap-4"
          onChange={(event) =>
            onDirtyChange(
              Object.entries(read(event.currentTarget)).some(
                ([key, value]) => value !== saved[key],
              ),
            )
          }
          onSubmit={(event) => {
            event.preventDefault();
            const changes = read(event.currentTarget);
            storePreferences.set((current) => ({ ...current, ...changes }));
            onDirtyChange(false);
            notify.success("Store settings saved");
          }}
        >
          {fields.map((field) => {
            const id = `${base}-${field.key}`;
            const input = {
              id,
              name: field.key,
              "aria-describedby": field.hint ? `${id}-hint` : undefined,
            };
            const value = String(saved[field.key] ?? "");
            return (
              <Field key={field.key}>
                <div
                  className={
                    field.type === "switch"
                      ? "flex items-center justify-between gap-4"
                      : "grid gap-2"
                  }
                >
                  <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
                  {field.type === "switch" ? (
                    <Switch {...input} defaultChecked={saved[field.key] === true} />
                  ) : field.type === "select" ? (
                    <NativeSelect {...input} defaultValue={value}>
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </NativeSelect>
                  ) : field.type === "textarea" ? (
                    <Textarea {...input} defaultValue={value} rows={3} maxLength={800} />
                  ) : field.type === "tax" ? (
                    <Input
                      {...input}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                      defaultValue={value}
                    />
                  ) : (
                    <Input
                      {...input}
                      type={field.type}
                      defaultValue={value}
                      className={field.type === "color" ? "w-20 p-1" : undefined}
                      maxLength={field.key === "order-prefix" ? 12 : 250}
                      pattern={field.key === "order-prefix" ? "[A-Za-z0-9\\-]*" : undefined}
                    />
                  )}
                </div>
                {field.hint && <FieldDescription id={`${id}-hint`}>{field.hint}</FieldDescription>}
              </Field>
            );
          })}
          {backup && (
            <div>
              <Button
                variant="outline"
                onClick={() =>
                  downloadFile(
                    "store-configuration.json",
                    JSON.stringify(
                      {
                        preferences: storePreferences.get(),
                        categories: categoriesStore.get(),
                        productAttributes: productAttributesStore.get(),
                        categoryAttributes: categoryAttributesStore.get(),
                        paymentMethods: paymentMethodsStore.get(),
                        shippingMethods: shippingMethodsStore.get(),
                      },
                      null,
                      2,
                    ),
                    "application/json",
                  )
                }
              >
                <Download aria-hidden="true" />
                Export configuration
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function AttributeSettings({
  store,
  formId,
  dirty,
  onDirtyChange,
}: SettingsEditor & Readonly<{ store: typeof productAttributesStore }>) {
  const entries = store.use();
  const [draft, setDraft] = useState<Attribute | "new" | null>(null);
  const [error, setError] = useState("");
  const base = useId();
  const editing = draft === "new" ? undefined : draft;
  return (
    <>
      {draft && (
        <Card className="shadow-none">
          <CardContent>
            <form
              id={formId}
              key={editing?.id ?? "new"}
              className="grid max-w-lg gap-4"
              onChange={(event) => {
                const data = new FormData(event.currentTarget);
                onDirtyChange(
                  fieldText(data, "name") !== (editing?.name ?? "") ||
                    splitList(fieldText(data, "options")).join(",") !==
                      (editing?.options.join(",") ?? ""),
                );
              }}
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const name = fieldText(data, "name");
                const current = store.get();
                if (
                  current.some(
                    (entry) =>
                      entry.id !== editing?.id && entry.name.toLowerCase() === name.toLowerCase(),
                  )
                ) {
                  setError("An attribute with this name already exists.");
                  return;
                }
                store.set(
                  withRecord(current, {
                    id: editing?.id ?? nextConfigId("attribute"),
                    name,
                    options: splitList(fieldText(data, "options")),
                  }),
                );
                setDraft(null);
                onDirtyChange(false);
                notify.success("Attribute saved");
              }}
            >
              <Field>
                <FieldLabel htmlFor={`${base}-name`}>Attribute name</FieldLabel>
                <Input
                  id={`${base}-name`}
                  name="name"
                  required
                  pattern=".*\S.*"
                  maxLength={60}
                  defaultValue={editing?.name}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${base}-error` : undefined}
                  onChange={() => setError("")}
                />
                <FieldError id={`${base}-error`} errors={[error]} />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${base}-options`}>Options</FieldLabel>
                <Input
                  id={`${base}-options`}
                  name="options"
                  defaultValue={editing?.options.join(", ")}
                  maxLength={260}
                  aria-describedby={`${base}-hint`}
                />
                <FieldDescription id={`${base}-hint`}>
                  Separate options with commas. Leave blank for a text field.
                </FieldDescription>
              </Field>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft(null);
                    onDirtyChange(false);
                  }}
                >
                  Cancel edit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Card className="shadow-none">
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="break-words text-sm font-medium">{entry.name}</p>
                <p className="break-words text-xs text-muted-foreground">
                  {entry.options.join(", ") || "Text"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={dirty}
                aria-label={`Edit ${entry.name}`}
                onClick={() => {
                  setError("");
                  setDraft(entry);
                }}
              >
                <Pencil aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
      <div>
        <Button
          variant="outline"
          disabled={dirty}
          onClick={() => {
            setError("");
            setDraft("new");
          }}
        >
          <Plus aria-hidden="true" />
          Add attribute
        </Button>
      </div>
    </>
  );
}

function MethodSettings({
  store,
  shipping = false,
  formId,
  dirty,
  onDirtyChange,
}: SettingsEditor & Readonly<{ store: typeof paymentMethodsStore; shipping?: boolean }>) {
  const entries = store.use();
  const [draft, setDraft] = useState<Method | "new" | null>(null);
  const [error, setError] = useState("");
  const base = useId();
  const editing = draft === "new" ? undefined : draft;
  return (
    <>
      {draft && (
        <Card className="shadow-none">
          <CardContent>
            <form
              id={formId}
              key={editing?.id ?? "new"}
              className="grid max-w-lg gap-4"
              onChange={(event) => {
                const data = new FormData(event.currentTarget);
                onDirtyChange(
                  fieldText(data, "name") !== (editing?.name ?? "") ||
                    fieldText(data, "description") !== (editing?.description ?? "") ||
                    data.has("enabled") !== (editing?.enabled ?? true) ||
                    (shipping &&
                      Math.round(Number(fieldText(data, "rate")) * 100) !== (editing?.rate ?? 0)),
                );
              }}
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const current = store.get();
                const name = fieldText(data, "name");
                if (
                  current.some(
                    (entry) =>
                      entry.id !== editing?.id && entry.name.toLowerCase() === name.toLowerCase(),
                  )
                ) {
                  setError("A method with this name already exists.");
                  return;
                }
                store.set(
                  withRecord(current, {
                    id: editing?.id ?? nextConfigId("method"),
                    name,
                    description: fieldText(data, "description"),
                    enabled: data.has("enabled"),
                    rate: shipping ? Math.round(Number(fieldText(data, "rate")) * 100) : undefined,
                  }),
                );
                setDraft(null);
                onDirtyChange(false);
                notify.success("Method saved");
              }}
            >
              <Field>
                <FieldLabel htmlFor={`${base}-name`}>Method name</FieldLabel>
                <Input
                  id={`${base}-name`}
                  name="name"
                  required
                  pattern=".*\S.*"
                  defaultValue={editing?.name}
                  maxLength={60}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${base}-error` : undefined}
                  onChange={() => setError("")}
                />
                <FieldError id={`${base}-error`} errors={[error]} />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${base}-description`}>Description</FieldLabel>
                <Input
                  id={`${base}-description`}
                  name="description"
                  defaultValue={editing?.description}
                  maxLength={180}
                />
              </Field>
              {shipping && (
                <Field>
                  <FieldLabel htmlFor={`${base}-rate`}>Rate (USD)</FieldLabel>
                  <Input
                    id={`${base}-rate`}
                    name="rate"
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    required
                    defaultValue={(editing?.rate ?? 0) / 100}
                  />
                </Field>
              )}
              <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor={`${base}-enabled`}>Enabled</FieldLabel>
                <Switch
                  id={`${base}-enabled`}
                  name="enabled"
                  defaultChecked={editing?.enabled ?? true}
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft(null);
                    onDirtyChange(false);
                  }}
                >
                  Cancel edit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Card className="shadow-none">
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-words text-sm font-medium">{entry.name}</p>
                  <Badge variant={entry.enabled ? "success" : "outline"}>
                    {entry.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="mt-1 break-words text-xs text-muted-foreground">
                  {entry.description}
                </p>
              </div>
              {shipping && (
                <span className="text-sm tabular-nums">{formatPrice(entry.rate ?? 0)}</span>
              )}
              <Button
                variant="outline"
                size="icon"
                disabled={dirty}
                aria-label={`Edit ${entry.name}`}
                onClick={() => {
                  setError("");
                  setDraft(entry);
                }}
              >
                <Pencil aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
      <div>
        <Button
          variant="outline"
          disabled={dirty}
          onClick={() => {
            setError("");
            setDraft("new");
          }}
        >
          <Plus aria-hidden="true" />
          Add method
        </Button>
      </div>
    </>
  );
}
