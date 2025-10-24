"use client"
import React, { useState, useMemo } from 'react';

import InputsTab from '@/components/investments/InputsTab';
import ScenariosTab from '@/components/investments/ScenariosTab';
import OverviewTab from '@/components/investments/OverviewTab';

export default function GettingStarted() {
  const [activeTab, setActiveTab] = useState('inputs');
  
  // Inputs
  const [propertyPrice, setPropertyPrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(3.68);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [rentalYield, setRentalYield] = useState(3.5);
  const [propertyAppreciation, setPropertyAppreciation] = useState(2);
  const [taxRate, setTaxRate] = useState(35);
  const [etfReturn, setEtfReturn] = useState(8);
  const [waitYears, setWaitYears] = useState(5);
  const [monthlyEtfContribution, setMonthlyEtfContribution] = useState(500);

  const calculations = useMemo(() => {
    // Property calculations
    const downPaymentAmount = propertyPrice * (downPayment / 100);
    const transferTax = propertyPrice * 0.065;
    const notaryFees = propertyPrice * 0.02;
    const totalClosingCosts = transferTax + notaryFees;
    const totalInitialCost = downPaymentAmount + totalClosingCosts;
    
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyRate = mortgageRate / 100 / 12;
    const numPayments = mortgageTerm * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const annualRent = propertyPrice * (rentalYield / 100);
    const monthlyRent = annualRent / 12;
    const netMonthlyCashFlow = monthlyRent - monthlyPayment;
    
    // Tax benefits
    const annualDepreciation = propertyPrice * 0.8 * 0.02;
    const annualInterest = loanAmount * (mortgageRate / 100);
    const taxDeductions = annualDepreciation + annualInterest;
    const taxSavings = taxDeductions * (taxRate / 100);
    
    // Property value after waitYears
    const futurePropertyValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, waitYears);
    const remainingLoanAfterWait = loanAmount * Math.pow(1 + mortgageRate / 100, waitYears) - 
      (monthlyPayment * 12 * waitYears * Math.pow(1 + mortgageRate / 100, waitYears / 2));
    const equityAfterWait = Math.max(0, futurePropertyValue - Math.max(0, remainingLoanAfterWait));
    
    // Property + ETF scenario
    const surplusForEtf = Math.max(0, netMonthlyCashFlow);
    const totalMonthlyEtf = monthlyEtfContribution + surplusForEtf;
    const monthlyEtfReturn = etfReturn / 100 / 12;
    
    const etfValueWithProperty = totalMonthlyEtf * 
      ((Math.pow(1 + monthlyEtfReturn, waitYears * 12) - 1) / monthlyEtfReturn);
    
    const totalWealthWithProperty = equityAfterWait + etfValueWithProperty;
    
    // ETF calculations - waiting scenario
    const etfWaitMonthly = monthlyEtfContribution + monthlyPayment + Math.abs(Math.min(0, netMonthlyCashFlow));
    
    const etfValueAfterWait = totalInitialCost * Math.pow(1 + etfReturn / 100, waitYears) +
      etfWaitMonthly * ((Math.pow(1 + monthlyEtfReturn, waitYears * 12) - 1) / monthlyEtfReturn);
    
    const propertyPriceAfterWait = propertyPrice * Math.pow(1 + propertyAppreciation / 100, waitYears);
    const downPaymentAfterWait = propertyPriceAfterWait * (downPayment / 100);
    const closingCostsAfterWait = propertyPriceAfterWait * 0.085;
    const totalCostAfterWait = downPaymentAfterWait + closingCostsAfterWait;
    
    const remainingAfterPurchase = etfValueAfterWait - totalCostAfterWait;
    
    return {
      property: {
        totalInitialCost: Math.round(totalInitialCost),
        closingCosts: Math.round(totalClosingCosts),
        monthlyPayment: Math.round(monthlyPayment),
        monthlyRent: Math.round(monthlyRent),
        netMonthlyCashFlow: Math.round(netMonthlyCashFlow),
        annualTaxSavings: Math.round(taxSavings),
        monthlyEtfContribution: Math.round(totalMonthlyEtf),
        etfValueWithProperty: Math.round(etfValueWithProperty),
        totalWealthWithProperty: Math.round(totalWealthWithProperty),
        equityAfterWait: Math.round(equityAfterWait)
      },
      etfWait: {
        totalSaved: Math.round(totalInitialCost),
        monthlyInvestment: Math.round(etfWaitMonthly),
        etfValueAfterWait: Math.round(etfValueAfterWait),
        propertyPriceAfterWait: Math.round(propertyPriceAfterWait),
        totalCostAfterWait: Math.round(totalCostAfterWait),
        remainingAfterPurchase: Math.round(remainingAfterPurchase)
      }
    };
  }, [propertyPrice, downPayment, mortgageRate, mortgageTerm, rentalYield, 
      propertyAppreciation, taxRate, etfReturn, waitYears, monthlyEtfContribution]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inputs')}
              className={`px-6 py-3 font-medium ${activeTab === 'inputs' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Inputs
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-6 py-3 font-medium ${activeTab === 'scenarios' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Scenarios
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${activeTab === 'overview' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'inputs' && (
            <InputsTab
              propertyPrice={propertyPrice}
              setPropertyPrice={setPropertyPrice}
              downPayment={downPayment}
              setDownPayment={setDownPayment}
              mortgageRate={mortgageRate}
              setMortgageRate={setMortgageRate}
              mortgageTerm={mortgageTerm}
              setMortgageTerm={setMortgageTerm}
              rentalYield={rentalYield}
              setRentalYield={setRentalYield}
              propertyAppreciation={propertyAppreciation}
              setPropertyAppreciation={setPropertyAppreciation}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              etfReturn={etfReturn}
              setEtfReturn={setEtfReturn}
              waitYears={waitYears}
              setWaitYears={setWaitYears}
              monthlyEtfContribution={monthlyEtfContribution}
              setMonthlyEtfContribution={setMonthlyEtfContribution}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenariosTab calculations={calculations} waitYears={waitYears} />
          )}

          {activeTab === 'overview' && (
            <OverviewTab calculations={calculations} waitYears={waitYears} />
          )}
        </div>
      </div>
    </div>
  );
}