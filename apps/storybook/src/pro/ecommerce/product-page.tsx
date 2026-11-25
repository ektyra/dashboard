import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Package, Save } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Dropzone } from "../../components/dropzone";
import { EmptyState } from "../../components/empty-state";
import { Field, FieldError, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import { RichTextEditor } from "../../components/rich-text-editor";
import { readFileAsDataUrl } from "../../lib/read-file";
import { notify } from "../../toast";
import { primaryActionClass, ProductPhoto } from "./commerce-ui";
import { productsStore, productStatuses, saveProduct } from "./store";
import type { Discount, Product } from "./store";
import { categoriesStore, productAttributesStore } from "./config";
import { sellers } from "./marketplace";
import { AttributeFields } from "./commerce-ui";

export function ProductPage({ productId }: Readonly<{ productId: string }>) {
  const product = productsStore.use((entries) => entries.find((entry) => entry.id === productId));

  if (!product && productId !== "new") {
    return (
      <>
        <PageHeader title="Product not found" current="Product not found" />
        <EmptyState
          icon={<Package aria-hidden="true" />}
          title="This product is unavailable"
          action={
            <Button variant="outline" asChild>
              <Link to="/apps/ecommerce/products">
                <ArrowLeft aria-hidden="true" />
                Back to products
              </Link>
            </Button>
          }
        />
      </>
    );
  }

  return <ProductForm key={productId} product={product} />;
}

function ProductSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const maxFileSize = 2_000_000;
const imageTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

function ProductForm({ product }: Readonly<{ product?: Product }>) {
  const id = useId();
  const navigate = useNavigate();
  const [skuError, setSkuError] = useState(false);
  const [discountError, setDiscountError] = useState(false);
  const categories = categoriesStore.use();
  const attributeDefinitions = productAttributesStore.use();
  const selectableCategories = categories.filter(
    (entry) => entry.active || entry.id === product?.category,
  );
  const [category, setCategory] = useState(product?.category ?? selectableCategories[0]?.id ?? "");
  const [sellerId, setSellerId] = useState(product?.sellerId ?? "");
  const activeCategory = categories.find((entry) => entry.id === category);
  const [attributes, setAttributes] = useState(product?.attributes ?? {});
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [discountType, setDiscountType] = useState<Discount["type"] | "">(
    product?.discount?.type ?? "",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [media, setMedia] = useState({ photo: product?.photo, imageUrl: product?.imageUrl });
  const [reading, setReading] = useState(false);
  const title = product?.name ?? "Add product";

  const initialDiscount = product?.discount
    ? product.discount.type === "fixed"
      ? (product.discount.amount / 100).toFixed(2)
      : product.discount.amount
    : undefined;

  return (
    <>
      <PageHeader
        title={title}
        current={title}
        subtitle={
          product
            ? "Edit catalog details, inventory, and pricing."
            : "Add an item to the demo catalog."
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/apps/ecommerce/products">Cancel</Link>
            </Button>
            <Button type="submit" form={id} className={primaryActionClass} loading={reading}>
              <Save aria-hidden="true" />
              {product ? "Save changes" : "Create product"}
            </Button>
          </>
        }
      />
      <form
        id={id}
        className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]"
        onSubmit={(event) => {
          event.preventDefault();
          if (reading) return;

          const data = new FormData(event.currentTarget);
          const read = (key: string) => {
            const value = data.get(key);
            return typeof value === "string" ? value.trim() : "";
          };
          const price = Math.round(Number(read("price")) * 100);
          const amount = Number(read("discount-amount"));
          const discount = discountType
            ? {
                type: discountType,
                amount: discountType === "fixed" ? Math.round(amount * 100) : amount,
              }
            : undefined;
          if (discount?.type === "fixed" && discount.amount > price) {
            setDiscountError(true);
            event.currentTarget
              .querySelector<HTMLInputElement>('input[name="discount-amount"]')
              ?.focus();
            return;
          }

          const saved = saveProduct(product?.id, {
            name: read("name"),
            sku: read("sku").toUpperCase(),
            price,
            stock: Number(read("stock")),
            category,
            sellerId: sellerId || undefined,
            attributes,
            subcategory,
            brand: read("brand"),
            tags: [
              ...new Set(
                read("tags")
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              ),
            ],
            status: productStatuses.find((option) => option === read("status")) ?? "Draft",
            description,
            discount,
            ...media,
          });
          if (!saved) {
            setSkuError(true);
            event.currentTarget.querySelector<HTMLInputElement>('input[name="sku"]')?.focus();
            return;
          }

          setSkuError(false);
          notify.success(product ? "Product updated" : "Product created", {
            description: saved.name,
          });
          if (!product)
            void navigate({
              to: "/apps/ecommerce/products/$productId",
              params: { productId: saved.id },
              replace: true,
            });
        }}
      >
        <div className="grid min-w-0 gap-5">
          <ProductSection title="Product information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor={`${id}-name`}>Product name</FieldLabel>
                <Input
                  id={`${id}-name`}
                  name="name"
                  defaultValue={product?.name}
                  required
                  pattern=".*\S.*"
                  maxLength={100}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-sku`}>SKU</FieldLabel>
                <Input
                  id={`${id}-sku`}
                  name="sku"
                  defaultValue={product?.sku}
                  required
                  pattern=".*\S.*"
                  maxLength={32}
                  aria-invalid={skuError}
                  aria-describedby={skuError ? `${id}-sku-error` : undefined}
                  onChange={() => setSkuError(false)}
                />
                <FieldError
                  id={`${id}-sku-error`}
                  errors={skuError ? ["That SKU is already in use."] : undefined}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-stock`}>Units in stock</FieldLabel>
                <Input
                  id={`${id}-stock`}
                  name="stock"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  defaultValue={product?.stock ?? 0}
                  required
                />
              </Field>
              <Field className="sm:col-span-2">
                <p className="text-sm font-medium">Product description</p>
                <RichTextEditor
                  label="Product description"
                  content={product?.description ?? ""}
                  onChange={setDescription}
                />
              </Field>
            </div>
          </ProductSection>
          <ProductSection title="Product image">
            <div className="grid gap-4">
              {(media.photo || media.imageUrl) && (
                <div className="flex flex-wrap items-center gap-3">
                  <ProductPhoto product={media} className="size-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={reading}
                    onClick={() => setMedia({ photo: undefined, imageUrl: undefined })}
                  >
                    Remove image
                  </Button>
                </div>
              )}
              <Dropzone
                className="px-4 py-6"
                title={reading ? "Reading image…" : "Drop an image here or click to browse"}
                hint="JPG, PNG, or WebP up to 2 MB"
                accept={imageTypes}
                maxSize={maxFileSize}
                multiple={false}
                disabled={reading}
                onFilesAccepted={([file]) => {
                  if (!file || reading) return;
                  setReading(true);
                  void readFileAsDataUrl(file)
                    .then((imageUrl) => setMedia({ photo: undefined, imageUrl }))
                    .catch(() => notify.error("Could not read the product image."))
                    .finally(() => setReading(false));
                }}
                onFilesRejected={() =>
                  notify.error("Choose one JPG, PNG, or WebP image under 2 MB.")
                }
              />
            </div>
          </ProductSection>
        </div>
        <div className="grid min-w-0 gap-5">
          <ProductSection title="Pricing">
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor={`${id}-price`}>Base price (USD)</FieldLabel>
                <Input
                  id={`${id}-price`}
                  name="price"
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  defaultValue={product ? (product.price / 100).toFixed(2) : undefined}
                  required
                  onChange={() => setDiscountError(false)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-discount`}>Discount type</FieldLabel>
                <NativeSelect
                  id={`${id}-discount`}
                  value={discountType}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDiscountType(next === "percentage" || next === "fixed" ? next : "");
                    setDiscountError(false);
                  }}
                >
                  <option value="">No discount</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </NativeSelect>
              </Field>
              {discountType && (
                <Field>
                  <FieldLabel htmlFor={`${id}-discount-amount`}>
                    Discount {discountType === "fixed" ? "(USD)" : "(%)"}
                  </FieldLabel>
                  <Input
                    key={discountType}
                    id={`${id}-discount-amount`}
                    name="discount-amount"
                    type="number"
                    min="0.01"
                    max={discountType === "percentage" ? "100" : "1000000"}
                    step="0.01"
                    defaultValue={
                      product?.discount?.type === discountType ? initialDiscount : undefined
                    }
                    required
                    aria-invalid={discountError}
                    aria-describedby={discountError ? `${id}-discount-error` : undefined}
                    onChange={() => setDiscountError(false)}
                  />
                  <FieldError
                    id={`${id}-discount-error`}
                    errors={
                      discountError ? ["The discount cannot exceed the base price."] : undefined
                    }
                  />
                </Field>
              )}
            </div>
          </ProductSection>
          <ProductSection title="Organization">
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor={`${id}-brand`}>Brand</FieldLabel>
                <Input
                  id={`${id}-brand`}
                  name="brand"
                  defaultValue={product?.brand}
                  maxLength={80}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-category`}>Category</FieldLabel>
                <NativeSelect
                  id={`${id}-category`}
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setSubcategory("");
                  }}
                  required
                >
                  <option value="">Choose a category</option>
                  {selectableCategories.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-subcategory`}>Subcategory</FieldLabel>
                <NativeSelect
                  id={`${id}-subcategory`}
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                >
                  <option value="">No subcategory</option>
                  {subcategory && !activeCategory?.subcategories.includes(subcategory) && (
                    <option>{subcategory}</option>
                  )}
                  {activeCategory?.subcategories.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-seller`}>Seller</FieldLabel>
                <NativeSelect
                  id={`${id}-seller`}
                  value={sellerId}
                  onChange={(event) => setSellerId(event.target.value)}
                >
                  <option value="">Unassigned</option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-status`}>Product status</FieldLabel>
                <NativeSelect
                  id={`${id}-status`}
                  name="status"
                  defaultValue={product?.status ?? "Draft"}
                >
                  {productStatuses.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-tags`}>Tags</FieldLabel>
                <Input
                  id={`${id}-tags`}
                  name="tags"
                  defaultValue={product?.tags?.join(", ")}
                  placeholder="Separate tags with commas"
                  maxLength={200}
                />
              </Field>
            </div>
          </ProductSection>
          {attributeDefinitions.length > 0 && (
            <ProductSection title="Product attributes">
              <AttributeFields
                definitions={attributeDefinitions}
                values={attributes}
                onChange={setAttributes}
              />
            </ProductSection>
          )}
        </div>
      </form>
    </>
  );
}
