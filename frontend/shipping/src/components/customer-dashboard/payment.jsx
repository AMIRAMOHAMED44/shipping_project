import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";

export default function Checkout() {
  const { api } = useContext(AuthContext);
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
        await actions.order.capture();
        try {
          await api.post("/account/upgrade/", { plan_id: plan.id });
          localStorage.removeItem("selectedPlan");
          navigate("/dashboard");
        } catch (err) {
          console.error("Upgrade failed:", err.response?.data || err.message);
          alert("Plan upgrade failed.");
        }
      },
    }).render("#paypal-button-container");
  }, [plan, api, navigate]);

  if (!plan) return <div className="text-center mt-10">No plan selected.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Confirm Payment for {plan.name} - ${plan.price}
      </h2>
      <div id="paypal-button-container"></div>
    </div>
  );
}