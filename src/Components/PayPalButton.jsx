import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalRef = useRef();

  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amount.toString() },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            if (onSuccess) {
              onSuccess(order); // Call parent callback
            }
          },
          onError: (err) => {
            console.error(err);
            toast.error("Payment failed. Please try again.");
          },
        })
        .render(paypalRef.current);
    }
  }, [amount, onSuccess]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
