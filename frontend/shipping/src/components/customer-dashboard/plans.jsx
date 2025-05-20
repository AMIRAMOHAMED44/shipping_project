import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PLANS = [
  {
    id: 'regular',
    name: 'Regular',
    price: 0,
    features: [
      'Basic shipping',
      'Shipping weight limit up to 5 kg',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    features: [
      'Shipping weight limit up to 20 kg',
      'Real-time shipment tracking',
      'Unlimited shipments',
      'Phone and email customer support',
      'Discounts on bulk shipments',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 150,
    features: [
      'Shipping weight limit up to 50 kg',
      'Advanced tracking with instant alerts',
      'Unlimited priority shipments',
      '24/7 support via phone, email, and chat',
      'Detailed reports and monthly shipment analytics',
      'Multiple user accounts per company',
    ],
  },
];

const UpgradePlans = () => {
  const { user } = useSelector((state) => state.auth);
  const currentPlanId = user?.current_plan?.name?.toLowerCase();

  const handleUpgrade = async (planId) => {
    try {
      const response = await axiosInstance.post("/api/account/upgrade/", {
        plan_id: planId
      });

      if (response.status === 200) {
        toast.success("Plan upgraded successfully!");
        window.location.reload(); // لإعادة تحميل بيانات المستخدم
      } else {
        toast.error("Upgrade failed. Please try again.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <PayPalScriptProvider 
      options={{ 
        "client-id": "AeR1Lb5gdCtQfg_6YW3fzK57h4xK-aOlLLaVK4AYScutG3zZ82xkMw0ZC06HHezF-WaSdEYl454IPhBg",
        "currency": "USD"
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-center text-3xl font-bold text-teal-600 mb-10">
          Upgrade Your Shipping Plan
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlanId === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`rounded-xl p-6 shadow-lg flex flex-col h-full 
                  ${isCurrentPlan 
                    ? 'border-2 border-teal-500 bg-teal-50' 
                    : 'border border-gray-200 bg-white'}`}
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-teal-600 mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-4">
                    {plan.price > 0 ? `$${plan.price}` : 'Free'}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-teal-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <button
                      className="w-full py-2 px-4 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </button>
                  ) : plan.price === 0 ? (
                    <button
                      className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      Choose Free Plan
                    </button>
                  ) : (
                    <PayPalButtons
                      style={{ 
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "subscribe"
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: plan.price.toString(),
                              currency_code: "USD"
                            },
                          }],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          await actions.order.capture();
                          await handleUpgrade(plan.id);
                        } catch (err) {
                          toast.error("Payment processing failed");
                          console.error("PayPal error:", err);
                        }
                      }}
                      onError={(err) => {
                        toast.error("Payment failed. Please try again.");
                        console.error("PayPal error:", err);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default UpgradePlans;