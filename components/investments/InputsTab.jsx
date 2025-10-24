import React from 'react';


export default function InputsTab(  propertyPrice, setPropertyPrice,
  downPayment, setDownPayment,
  mortgageRate, setMortgageRate,
  mortgageTerm, setMortgageTerm,
  rentalYield, setRentalYield,
  propertyAppreciation, setPropertyAppreciation,
  taxRate, setTaxRate,
  etfReturn, setEtfReturn,
  waitYears, setWaitYears,
  monthlyEtfContribution, setMonthlyEtfContribution
) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Investment Parameters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Property Price (€)</label>
          <input
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">€200k - €800k typical</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Down Payment (%)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">20-40% typical</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mortgage Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={mortgageRate}
            onChange={(e) => setMortgageRate(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">3.5-4% in 2025</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mortgage Term (years)</label>
          <input
            type="number"
            value={mortgageTerm}
            onChange={(e) => setMortgageTerm(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">20-30 years typical</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gross Rental Yield (%)</label>
          <input
            type="number"
            step="0.1"
            value={rentalYield}
            onChange={(e) => setRentalYield(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">3-4% Germany avg</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Property Appreciation (%/yr)</label>
          <input
            type="number"
            step="0.1"
            value={propertyAppreciation}
            onChange={(e) => setPropertyAppreciation(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">1-3% typical</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Income Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">14-45% progressive</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">S&P ETF Return (%/yr)</label>
          <input
            type="number"
            step="0.1"
            value={etfReturn}
            onChange={(e) => setEtfReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">7-10% historical</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wait Years Before Buying</label>
          <input
            type="number"
            value={waitYears}
            onChange={(e) => setWaitYears(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">Years to invest first</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Monthly ETF Contribution (€)</label>
          <input
            type="number"
            value={monthlyEtfContribution}
            onChange={(e) => setMonthlyEtfContribution(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
          <span className="text-xs text-gray-500">Additional monthly investment</span>
        </div>
      </div>
    </div>
  );
};

