import React from 'react';
import { AddonLicense, DeploymentType, PlanType } from '../types';

interface LicenseRowProps {
  addon: AddonLicense;
  quantity: number;
  deployment: DeploymentType;
  plan: PlanType;
  onChange: (val: number) => void;
}

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-blue-500 transition-colors cursor-help">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export const LicenseRow: React.FC<LicenseRowProps> = ({ addon, quantity, deployment, onChange }) => {
  // Determine text based on deployment
  const supplyText = deployment === DeploymentType.CLOUD ? addon.supplyCloud : addon.supplyLt;
  
  // Dynamic color for "included" vs "pay"
  const isIncluded = supplyText.toLowerCase().includes('включена');
  const supplyColorClass = isIncluded ? 'text-green-600 font-medium' : 'text-gray-500';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-red-300 transition-colors">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-semibold text-gray-800 truncate" title={addon.originalName}>{addon.originalName}</h4>
          
          {addon.description && (
            <div className="group relative">
              <InfoIcon />
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                {addon.description}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 truncate">{addon.name}</p>
        
        {/* Dynamic Supply Info */}
        <p className={`text-xs mt-1 ${supplyColorClass}`}>
          {deployment === DeploymentType.CLOUD ? 'Cloud: ' : 'LT: '}
          {supplyText}
        </p>

        <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
          <span className="whitespace-nowrap">{addon.monthlyUah} грн/міс</span>
          <span>•</span>
          <span className="whitespace-nowrap">Впровадження: {addon.setupUsd > 0 ? `${addon.setupIsFrom ? 'від ' : ''}$${addon.setupUsd}` : 'Безкоштовно'}</span>
          {addon.note && (
            <>
              <span>•</span>
              <span className="text-blue-600 whitespace-nowrap">{addon.note}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={() => onChange(Math.max(0, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-bold"
        >
          -
        </button>
        <span className="w-8 text-center font-medium text-lg text-gray-900">{quantity}</span>
        <button 
          onClick={() => onChange(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};