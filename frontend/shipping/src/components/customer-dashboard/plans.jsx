import React from 'react';

const plans = [
  {
    id: 'regular',
    name: 'Regular',
    price: 0,
    features: [
      'Basic shipping',
      'Shipping weight limit up to 5 kg',
    ],
    current: true,
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

const UpgradePlans = ({ onSelectPlan }) => {
  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#009689', marginBottom: 40 , fontSize: 30,fontWeight: 'bold'}}>Upgrade Your Shipping Plan</h1>
      <div style={{ display: 'flex', gap: 30, justifyContent: 'center', flexWrap: 'wrap' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: plan.current ? '2px solid #009689' : '1px solid #ccc',
              borderRadius: 12,
              padding: 30,
              width: 350,
              backgroundColor: plan.current ? '#e0f7f5' : '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 480,
            }}
          >
            <div>
              <h3 style={{ color: '#009689', fontSize: 24, marginBottom: 10 }}>{plan.name}</h3>
              <p style={{ fontSize: 18, fontWeight: 'bold' }}>${plan.price}</p>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{feature}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: 'auto' }}>
              {plan.current ? (
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ccc',
                    border: 'none',
                    borderRadius: 6,
                    color: '#333',
                    cursor: 'not-allowed',
                    width: '100%',
                  }}
                  disabled
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#009689',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Choose Plan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlans;
