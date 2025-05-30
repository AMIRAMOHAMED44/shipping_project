import { useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import AuthContext from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const plans = [
  {
    id: 'regular',
    name: 'Regular',
    price: 0,
    features: ['Basic shipping', 'Shipping weight limit up to 5 kg'],
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

export default function Payment() {
  const { user, api } = useContext(AuthContext);

  const handleUpgrade = async (planId) => {
    try {
      await api.post('/account/upgrade/', { plan_id: planId });
      console.log('Plan upgraded:', planId);
      toast.success('Plan upgraded successfully!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Upgrade failed:', error.response?.data || error.message);
      toast.error('Plan upgrade failed.');
    }
  };

  return (
    <PayPalScriptProvider
      options={{ 'client-id': 'AeR1Lb5gdCtQfg_6YW3fzK57h4xK-aOlLLaVK4AYScutG3zZ82xkMw0ZC06HHezF-WaSdEYl454IPhBg' }}
      onInit={() => console.log('PayPal script initialized')}
      onError={(err) => console.error('PayPal script error:', err)}
    >
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <h1 className="text-center text-teal-700 text-3xl font-bold mb-10">
          Upgrade Your Shipping Plan
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const currentPlanName = user?.current_plan?.name?.toLowerCase();
            const isCurrent = currentPlanName === plan.id.toLowerCase();

            return (
              <div
                key={plan.id}
                className={`border rounded-xl p-6 bg-white shadow-md flex flex-col justify-between h-[520px] ${
                  isCurrent ? 'border-teal-600 bg-teal-50' : 'border-teal-200'
                }`}
              >
                <div>
                  <h3 className="text-teal-700 text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-teal-900 text-lg font-semibold">${plan.price}</p>
                  <ul className="list-disc pl-5 text-teal-800 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="mb-2">{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  {isCurrent ? (
                    <button
                      className="w-full py-3 px-4 bg-teal-200 text-teal-700 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </button>
                  ) : plan.price === 0 ? (
                    <button
                      className="w-full py-3 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                      onClick={() => {
                        console.log('Choosing plan:', plan.id);
                        handleUpgrade(plan.id);
                      }}
                    >
                      Choose Free Plan
                    </button>
                  ) : (
                    <PayPalButtons
                      style={{ layout: 'vertical', label: 'pay', color: 'blue' }}
                      createOrder={(data, actions) => {
                        console.log('Creating PayPal order for plan:', plan.id);
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: plan.price.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        console.log('PayPal order approved:', data);
                        await actions.order.capture();
                        await handleUpgrade(plan.id);
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        toast.error('Payment failed. Please try again.');
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
}