import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const plan = JSON.parse(localStorage.getItem("selectedPlan"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.paypal || !plan) return;

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: plan.price.toString(),
            },
          }],
        });
      },
      onApprove: async (data, actions) => {
        const details = await actions.order.capture();

        // إرسال المعلومات للباك إند
        const access = localStorage.getItem("access");
        await fetch("http://localhost:8000/api/account/upgrade/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ plan_id: plan.id }),
        });

        navigate("/dashboard");
      },
    }).render("#paypal-button-container");
  }, [plan]);

  return (
    <div>
      <h2>Confirm Payment for {plan.name} - ${plan.price}</h2>
      <div id="paypal-button-container"></div>
    </div>
  );
}
