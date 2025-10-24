
import React from 'react'
import { TrendingUp, Home } from 'lucide-react';

export default function ScenariosTab({ calculations, waitYears }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Home className="text-blue-600" />
          <h3 className="text-lg font-semibold">Scenario 1: Buy Property + Invest Surplus</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Initial Investment:</span>
            <span className="font-semibold">€{calculations.property.totalInitialCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Closing Costs (8.5%):</span>
            <span>€{calculations.property.closingCosts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Mortgage:</span>
            <span className="font-semibold">€{calculations.property.monthlyPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Rent Income:</span>
            <span className="font-semibold text-green-600">€{calculations.property.monthlyRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span>Net Monthly Cash Flow:</span>
            <span className={`font-bold ${calculations.property.netMonthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{calculations.property.netMonthlyCashFlow.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Annual Tax Savings:</span>
            <span className="font-semibold text-green-600">€{calculations.property.annualTaxSavings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t bg-white -mx-2 px-2 py-2 rounded">
            <span className="font-medium">Monthly to ETF:</span>
            <span className="font-bold text-purple-600">€{calculations.property.monthlyEtfContribution.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>ETF Value After {waitYears}y:</span>
            <span className="font-semibold text-purple-600">€{calculations.property.etfValueWithProperty.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Property Equity After {waitYears}y:</span>
            <span className="font-semibold text-blue-600">€{calculations.property.equityAfterWait.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2 bg-blue-100 -mx-2 px-2 py-2 rounded">
            <span className="font-bold">Total Wealth After {waitYears}y:</span>
            <span className="font-bold text-blue-700">€{calculations.property.totalWealthWithProperty.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="text-green-600" />
          <h3 className="text-lg font-semibold">Scenario 2: Only ETF, Buy Property Later</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Initial ETF Investment:</span>
            <span className="font-semibold">€{calculations.etfWait.totalSaved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly ETF Contribution:</span>
            <span className="font-semibold">€{calculations.etfWait.monthlyInvestment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>(Down payment equivalent + mortgage + ETF)</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span>ETF Value After {waitYears} Years:</span>
            <span className="font-bold text-green-600">€{calculations.etfWait.etfValueAfterWait.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t">
            <span>Property Price Then:</span>
            <span className="font-semibold">€{calculations.etfWait.propertyPriceAfterWait.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Cost to Buy:</span>
            <span className="font-semibold">€{calculations.etfWait.totalCostAfterWait.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2 bg-green-100 -mx-2 px-2 py-2 rounded">
            <span className="font-bold">Total Wealth After {waitYears}y:</span>
            <span className={`font-bold ${calculations.etfWait.remainingAfterPurchase >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              €{calculations.etfWait.remainingAfterPurchase.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            (Property equity + remaining cash)
          </div>
        </div>
      </div>
    </div>
  );
};

