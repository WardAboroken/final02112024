// PayPalCheckoutButton.jsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from "react";

// PayPalCheckoutButton component for handling PayPal transactions
const PayPalCheckoutButton = ({
  totalAmount, // Total amount to be paid
  paypalEmail, // PayPal email of the merchant
  items, // Items included in the order
  merchantID, // PayPal Merchant ID, if available
  handlePlaceOrder, // Function to handle order placement upon successful payment
  order, // Order details object
}) => {
  // State to check if all required props are ready
  const [isReady, setIsReady] = useState(false);

  // useEffect to check if all necessary props are provided before rendering the PayPal button
  useEffect(() => {
    if (totalAmount && paypalEmail && items && handlePlaceOrder && order) {
      setIsReady(true); // Enable the PayPal button if all required props are provided
    } else {
      setIsReady(false); // Disable the PayPal button if any required prop is missing
    }
  }, [totalAmount, paypalEmail, items, handlePlaceOrder, merchantID, order]);

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Abyy9Z-JZx5mZiqXweLUvTFt5Ccg48FzSSeVCvo1MJmucY3Xfv_IiY75rwI9rkLbXzMuHoWMQTjvDv8D", // PayPal client ID
      }}
    >
      {isReady ? (
        // PayPal Buttons component that handles the payment UI and logic
        <PayPalButtons
          // Key property to force re-render if relevant props change
          key={`${totalAmount}-${merchantID}-${items.length}`}
          // createOrder callback: called when the PayPal order is created
          createOrder={(data, actions) => {
            if (!paypalEmail) {
              console.error("PayPal email is missing.");
              alert(
                "Merchant information is missing. Cannot proceed with payment."
              );
              return;
            }

            // Clean up the merchantID by removing any extra spaces or newline characters
            const cleanedMerchantID = merchantID?.trim();

            // Define the purchase units payload
            const purchaseUnits = [
              {
                amount: {
                  currency_code: "USD",
                  value: totalAmount,
                },
                payee: cleanedMerchantID
                  ? { merchant_id: cleanedMerchantID }
                  : { email_address: paypalEmail }, // Use email if merchant_id is not provided
              },
            ];

            console.log("Creating order with the following payload:", {
              purchase_units: purchaseUnits,
            });

            // Create the PayPal order
            return actions.order.create({
              purchase_units: purchaseUnits,
            });
          }}
          // onApprove callback: called when the payment is successfully approved
          onApprove={async (data, actions) => {
            try {
              const capturedOrder = await actions.order.capture(); // Capture the order
              console.log("Order successfully captured:", capturedOrder);

              handlePlaceOrder(order); // Call the handlePlaceOrder function with the order details
              alert("Transaction completed successfully.");
            } catch (error) {
              console.error("Error during transaction approval:", error);
              alert(
                "An error occurred during the transaction. Please try again."
              );
            }
          }}
          // onError callback: called when an error occurs during the PayPal transaction
          onError={(error) => {
            console.error("PayPal Checkout Error:", error);
            alert("An error occurred during payment. Please try again.");
          }}
        />
      ) : (
        // Loading message displayed until the PayPal button is ready
        <p>Loading PayPal...</p>
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;
