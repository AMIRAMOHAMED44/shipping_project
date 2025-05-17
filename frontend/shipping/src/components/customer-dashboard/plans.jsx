import React from 'react';

const plans = [
  {
    id: 'regular',
    name: 'Regular',
    price: 0,
    features: ['Basic shipping', 'Weight limit: 10kg'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    features: ['Priority shipping', 'Weight limit: 50kg', 'Discounts on shipments'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 99.99,
    features: ['All Premium features', 'Weight limit: 200kg', 'Dedicated support'],
  },
];

const UpgradePlans = ({ onSelectPlan }) => {
  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>Upgrade Your Plan</h2>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        {plans.map(plan => (
          <div key={plan.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, width: 220 }}>
            <h3>{plan.name}</h3>
            <p><strong>Price:</strong> ${plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => <li key={i}>{feature}</li>)}
            </ul>
            <button onClick={() => onSelectPlan(plan.id)}>Choose Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlans;
