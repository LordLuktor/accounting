import React, { useState } from 'react';

const BillingManagement: React.FC = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <button
      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      onClick={() => setShowPaymentForm(true)}
    >
      Manage
    </button>
  );
};

export default BillingManagement;