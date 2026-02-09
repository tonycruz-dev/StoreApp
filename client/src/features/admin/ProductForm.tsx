import { useForm } from "react-hook-form";
import {
  createProductSchema,
  type CreateProductSchema,
} from "../../lib/schemas/createProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import AppTextInput from "../../app/shared/components/AppTextInput";
import { useFetchFiltersQuery } from "../catalog/catalogApi";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import AppDropzone from "../../app/shared/components/AppDropzone";
import type { Product } from "../../app/models/product";
import { useEffect } from "react";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";
import { LoadingButton } from "@mui/lab";
import { handleApiError } from "../../lib/util";
import { useWatch } from "react-hook-form";
import type { z } from "zod";

type FileWithPreview = File & { preview?: string };

type ProductFormValues = z.input<typeof createProductSchema>;

type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (value: Product | null) => void;
};

export default function ProductForm({
  setEditMode,
  product,
  refetch,
  setSelectedProduct,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    mode: "onTouched",
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "" as unknown as number,
      type: "",
      brand: "",
      quantityInStock: "" as unknown as number,
      pictureUrl: "",
      file: undefined,
    },
  });

  const watchFile = useWatch({ control, name: "file" }) as
    | FileWithPreview
    | undefined;

  const { data } = useFetchFiltersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        // ensure numeric form values
        price: Number(product.price),
        type: product.type,
        brand: product.brand,
        quantityInStock: Number(product.quantityInStock),
        pictureUrl: product.pictureUrl ?? "",
        file: undefined,
      });
    }

    return () => {
      if (watchFile?.preview) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile?.preview]);

  const createFormData = (items: CreateProductSchema) => {
    const formData = new FormData();
    for (const key in items) {
      if (key === "file") continue;
      const value = items[key as keyof CreateProductSchema];
      if (value === undefined || value === null) continue;
      formData.append(key, String(value));
    }

    return formData;
  };

  const onSubmit = async (values: ProductFormValues) => {
    // Parse/coerce using the schema so we always send the correct DTO.
    const data = createProductSchema.parse(values);

    try {
      const formData = createFormData(data);

      if (values.file) formData.append("file", values.file);

      if (product)
        await updateProduct({ id: product.id, data: formData }).unwrap();
      else await createProduct(formData).unwrap();
      setEditMode(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.log(error);
      handleApiError<CreateProductSchema>(error, setError, [
        "brand",
        "description",
        "file",
        "name",
        "pictureUrl",
        "price",
        "quantityInStock",
        "type",
      ]);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput<ProductFormValues>
              control={control}
              name="name"
              label="Product name"
            />
          </Grid>
          <Grid size={6}>
            {data?.brands && (
              <AppSelectInput<ProductFormValues>
                items={data.brands}
                control={control}
                name="brand"
                label="Brand"
              />
            )}
          </Grid>
          <Grid size={6}>
            {data?.brands && (
              <AppSelectInput<ProductFormValues>
                items={data.types}
                control={control}
                name="type"
                label="Type"
              />
            )}
          </Grid>
          <Grid size={6}>
            <AppTextInput<ProductFormValues>
              type="number"
              control={control}
              name="price"
              label="Price in cents"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput<ProductFormValues>
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in stock"
            />
          </Grid>
          <Grid size={12}>
            <AppTextInput<ProductFormValues>
              control={control}
              multiline
              rows={4}
              name="description"
              label="Description"
            />
          </Grid>
          <Grid
            size={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <AppDropzone name="file" control={control} />
            {watchFile?.preview ? (
              <img
                src={watchFile.preview}
                alt="preview of image"
                style={{ maxHeight: 200 }}
              />
            ) : product?.pictureUrl ? (
              <img
                src={product?.pictureUrl}
                alt="preview of image"
                style={{ maxHeight: 200 }}
              />
            ) : null}
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            onClick={() => setEditMode(false)}
            variant="contained"
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}
