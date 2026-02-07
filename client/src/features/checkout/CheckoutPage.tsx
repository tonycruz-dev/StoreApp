import { Grid, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useFetchBasketQuery } from "../basket/basketApi";
import { useEffect, useRef } from "react";
import { useCreatePaymentIntentMutation } from "./checkoutApi";
import { useAppSelector } from "../../app/store/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery();
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();
  const created = useRef(false);
  const { darkMode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (!created.current) createPaymentIntent();
    created.current = true;
  }, [createPaymentIntent]);

  const options: StripeElementsOptions | undefined = !basket?.clientSecret
    ? undefined
    : {
        clientSecret: basket.clientSecret,
        appearance: {
          labels: "floating",
          theme: darkMode ? "night" : "stripe",
        },
      };

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {!stripePromise || !options || isLoading ? (
          <Typography variant="h6">Loading checkout...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid>
      <Grid size={4}>
        <OrderSummary />
      </Grid>
    </Grid>
  );
}
