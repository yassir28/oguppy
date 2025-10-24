import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function OverviewTab({ calculations, waitYears }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Comparison Summary</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="font-medium">After {waitYears} Years:</div>
          <div></div>
          
          <div className="pl-4">Buy Now Total Wealth:</div>
          <div className="text-right font-bold text-blue-600">
            €{calculations.property.totalWealthWithProperty.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 pl-4 -mt-2">Property + ETF</div>
          <div></div>
          
          <div className="pl-4">Wait & Buy Total Wealth:</div>
          <div className="text-right font-bold text-green-600">
            €{calculations.etfWait.remainingAfterPurchase.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 pl-4 -mt-2">Property + Cash</div>
          <div></div>
          
          <div className="border-t pt-2 font-bold text-lg">Winner:</div>
          <div className="border-t pt-2 text-right font-bold text-lg">
            {calculations.property.totalWealthWithProperty > calculations.etfWait.remainingAfterPurchase 
              ? `Buy Now +€${(calculations.property.totalWealthWithProperty - calculations.etfWait.remainingAfterPurchase).toLocaleString()}`
              : `Wait +€${(calculations.etfWait.remainingAfterPurchase - calculations.property.totalWealthWithProperty).toLocaleString()}`
            }
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold mb-3">Total Wealth Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            {
              scenario: 'Buy Now',
              'Property Equity': calculations.property.equityAfterWait,
              'ETF Portfolio': calculations.property.etfValueWithProperty,
              total: calculations.property.totalWealthWithProperty
            },
            {
              scenario: 'Wait & Buy',
              'Property Equity': calculations.etfWait.remainingAfterPurchase > 0 ? calculations.etfWait.propertyPriceAfterWait - calculations.etfWait.totalCostAfterWait : 0,
              'Cash/ETF': calculations.etfWait.remainingAfterPurchase,
              total: calculations.etfWait.remainingAfterPurchase
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scenario" />
            <YAxis />
            <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Property Equity" stackId="a" fill="#3b82f6" />
            <Bar dataKey="ETF Portfolio" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="Cash/ETF" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Buy Now Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={[
                  { name: 'Property Equity', value: calculations.property.equityAfterWait },
                  { name: 'ETF Investments', value: calculations.property.etfValueWithProperty }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#8b5cf6" />
              </Pie>
              <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Monthly Cash Flow</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              {
                scenario: 'Buy Now',
                'Rent Income': calculations.property.monthlyRent,
                'Mortgage Payment': -calculations.property.monthlyPayment,
                'ETF Investment': -calculations.property.monthlyEtfContribution
              },
              {
                scenario: 'Wait',
                'ETF Investment': -calculations.etfWait.monthlyInvestment
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis />
              <Tooltip formatter={(value) => `€${Math.abs(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Rent Income" fill="#10b981" />
              <Bar dataKey="Mortgage Payment" fill="#ef4444" />
              <Bar dataKey="ETF Investment" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">Key Factors in Germany:</h4>
        <ul className="space-y-1 list-disc list-inside text-gray-700">
          <li>Closing costs: 8.5% (6.5% transfer tax + 2% notary)</li>
          <li>Mortgage rates: 3.5-4% (10yr fixed typical)</li>
          <li>Tax deduction: 2% depreciation + interest</li>
          <li>Rental yields: 3-4% gross nationwide</li>
          <li>No capital gains tax after 10 years</li>
        </ul>
      </div>
    </div>
  );
};

