import React, { useState, useMemo, useEffect } from 'react';
import { PlanType, DeploymentType, AddonLicense } from './types';
import { FRONT_PRICING_TABLE, ADDON_LICENSES, FRONT_LICENSES_LIST } from './constants';
import { LicenseRow } from './components/LicenseRow';
import { LicenseChecker } from './components/LicenseChecker';

// IDs for mobile/app licenses to separate them
const MOBILE_IDS = ['waiter', 'driver', 'dashboard_rms', 'dashboard_tg'];

// Icon components
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2-2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
  </svg>
);

const ServerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

const App: React.FC = () => {
  // State
  const [plan, setPlan] = useState<PlanType>(PlanType.PRO);
  const [deployment, setDeployment] = useState<DeploymentType>(DeploymentType.CLOUD);
  const [currentFronts, setCurrentFronts] = useState<number>(1);
  const [addedFronts, setAddedFronts] = useState<number>(0);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const [isFrontInfoOpen, setIsFrontInfoOpen] = useState(false);

  // Logic: Reset added fronts if switched to LT
  useEffect(() => {
    if (deployment === DeploymentType.LT) {
      setAddedFronts(0);
    }
  }, [deployment]);

  // Derived Data
  const mobileAddons = useMemo(() => ADDON_LICENSES.filter(a => MOBILE_IDS.includes(a.id)), []);
  const otherAddons = useMemo(() => ADDON_LICENSES.filter(a => !MOBILE_IDS.includes(a.id)), []);
  const isLt = deployment === DeploymentType.LT;

  // Handlers
  const handleAddonChange = (id: string, qty: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [id]: qty
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations
  const calculation = useMemo(() => {
    let monthlyUah = 0;
    let setupUsd = 0;
    const details: string[] = [];

    // 1. Calculate Fronts Cost (Only for Cloud)
    if (!isLt && addedFronts > 0) {
      const futureTotal = currentFronts + addedFronts;
      
      // LOGIC UPDATE: Unit price is determined by the Total Future Quantity.
      // We find the tier that corresponds to the N-th license (where N = futureTotal)
      // and apply that single price to ALL added licenses.
      
      // Tier Index Mapping:
      // futureTotal = 2 (1->2) => Index 0 (Price 1055)
      // futureTotal = 3 (1->3) => Index 1 (Price 1572)
      // futureTotal = 4 (1->4) => Index 2 (Price 1389)
      // futureTotal >= 5       => Index 3 (Price 1257)
      
      let tierIndex: number;
      if (futureTotal >= 5) {
        tierIndex = 3;
      } else {
        // Calculate index for counts 2, 3, 4
        tierIndex = Math.max(0, futureTotal - 2);
      }
      
      const tier = FRONT_PRICING_TABLE[tierIndex];
      const cost = plan === PlanType.PRO ? tier.proMonthlyUah : tier.enterpriseMonthlyUah;
      
      const totalMonthly = cost * addedFronts;
      const totalSetup = tier.setupUsd * addedFronts;
      
      monthlyUah += totalMonthly;
      setupUsd += totalSetup;
      details.push(`Syrve POS (Front) x${addedFronts}: +${totalMonthly} грн/міс (Впровадження: $${totalSetup})`);

    } else if (isLt && addedFronts > 0) {
       // Should not happen due to UI block, but safe guard
       details.push(`ПОПЕРЕДЖЕННЯ: Дозамовлення фронтів для LT не розраховується в цьому калькуляторі.`);
    }

    // 2. Calculate Addons Cost
    Object.entries(addonQuantities).forEach(([id, val]) => {
      const qty = val as number;
      if (qty > 0) {
        const addon = ADDON_LICENSES.find(a => a.id === id);
        if (addon) {
          const itemMonthly = addon.monthlyUah * qty;
          const itemSetup = addon.setupUsd * qty;
          
          // Warning for LT regarding monthly prices
          const suffix = isLt ? ' (Ціна Cloud)' : '';
          
          monthlyUah += itemMonthly;
          setupUsd += itemSetup;
          
          const setupStr = itemSetup > 0 
            ? `${addon.setupIsFrom ? 'від ' : ''}$${itemSetup}` 
            : 'Безкоштовно';
            
          details.push(`${addon.originalName} x${qty}: +${itemMonthly} грн/міс${suffix} (Впровадження: ${setupStr})`);
        }
      }
    });

    return { monthlyUah, setupUsd, details };
  }, [plan, currentFronts, addedFronts, addonQuantities, isLt]);


  // Text Generation (Page 5 & 6 Template)
  const generateMessage = () => {
    const totalSetupStr = calculation.setupUsd > 0 ? `+${calculation.setupUsd}$` : '0$';
    
    let message = `Вітаю!

Прошу погодити вартість:
- ліцензія + ${calculation.monthlyUah} грн/міс до поточного рахунку з урахуванням знижки 50% до кінця воєнного положення
- впровадження: ${totalSetupStr}

Деталізація:
${calculation.details.map(d => `- ${d}`).join('\n')}`;

    return message;
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Syrve Logo approximation with text */}
             <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                   syrve <span className="text-red-600 text-base font-normal">calculator</span>
                </h1>
                <span className="text-xs text-gray-500">dao logistics llc</span>
             </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Останнє оновлення: 24.11.2025р.</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 py-6">
        
        {/* Main Grid System - 5 Columns on Large Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
          
          {/* COLUMN 1: License Checker */}
          <div className="space-y-6">
            <LicenseChecker />
          </div>

          {/* COLUMN 2: Settings & Fronts */}
          <div className="space-y-6">
            {/* Section 1: Base Configuration */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">1. Налаштування</h2>
              
              <div className="space-y-6">
                {/* Deployment Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип розміщення</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setDeployment(DeploymentType.CLOUD)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        deployment === DeploymentType.CLOUD 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <CloudIcon />
                      Cloud
                    </button>
                    <button
                      onClick={() => setDeployment(DeploymentType.LT)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        deployment === DeploymentType.LT 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ServerIcon />
                      LT
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 leading-tight">
                    {deployment === DeploymentType.CLOUD
                      ? "Сервери у хмарі (SaaS)."
                      : "Сервери локально (Lifetime)."}
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Plan Selector */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLt ? 'text-gray-400' : 'text-gray-700'}`}>
                    Тип підписки
                  </label>
                  <div className={`flex bg-gray-100 p-1 rounded-lg ${isLt ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                      onClick={() => setPlan(PlanType.PRO)}
                      className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        plan === PlanType.PRO 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      PRO
                    </button>
                    <button
                      onClick={() => setPlan(PlanType.ENTERPRISE)}
                      className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        plan === PlanType.ENTERPRISE 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Enterprise
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Поточні фронти</label>
                  <select 
                    value={currentFronts}
                    onChange={(e) => setCurrentFronts(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2.5 border text-gray-900"
                  >
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num} className="text-gray-900">{num} {num === 1 ? 'фронт' : num < 5 ? 'фронта' : 'фронтів'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 2: Add Fronts */}
            <section className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-opacity ${isLt ? 'opacity-70' : ''}`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">2. Дозамовлення POS</h2>
              
              {isLt ? (
                <div className="bg-orange-50 border border-orange-200 text-orange-800 px-3 py-2 rounded-lg text-xs mb-2">
                   <strong>Недоступне для LT.</strong>
                </div>
              ) : (
                <div className="flex items-center gap-4 justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Кількість нових фронтів
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setAddedFronts(Math.max(0, addedFronts - 1))}
                      disabled={isLt}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xl text-gray-900">{addedFronts}</span>
                    <button 
                      onClick={() => setAddedFronts(addedFronts + 1)}
                      disabled={isLt}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Accordion / Spoiler for Front Licenses List - Moved BELOW counter */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setIsFrontInfoOpen(!isFrontInfoOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-gray-700">Детальна інформація про ліцензії POS</span>
                  <span className="text-gray-500">
                    {isFrontInfoOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </span>
                </button>
                
                {isFrontInfoOpen && (
                  <div className="bg-white p-3 space-y-3 max-h-60 overflow-y-auto">
                    {FRONT_LICENSES_LIST.map((info, idx) => {
                       const supplyText = deployment === DeploymentType.CLOUD ? info.supplyCloud : info.supplyLt;
                       const isAllowed = !supplyText.includes('неможливе');
                       
                       return (
                         <div key={idx} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                           <p className="font-semibold text-xs text-gray-800 mb-1">{info.name}</p>
                           <p className="text-[10px] text-gray-500 mb-1">{info.module}</p>
                           <p className={`text-[10px] font-medium ${isAllowed ? 'text-green-600' : 'text-red-500'}`}>
                             {deployment === DeploymentType.CLOUD ? 'Cloud: ' : 'LT: '}
                             {supplyText}
                           </p>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            </section>

             {/* Important Note Section */}
            <section className="bg-yellow-50 rounded-xl shadow-sm p-4 border border-yellow-200">
               <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                 Важливо!
               </h3>
               <div className="text-[11px] text-yellow-900 space-y-3 opacity-90 leading-snug">
                 <p>
                   *DashBoard (for RMS): є різновиди цих ліцензій, тому якщо заклад у складі Chainy - варто порадитися по замовленню з відділом впровадження \ керівником технічної підтримки.
                 </p>
                 <p>
                   *Вартість впровадження розраховується на 1 * РМС. У 99% випадків вона дійсно складає $100, але якщо ТЗ вам здається геть закрученим - варто порадитися по вартості з відділом впровадження \ керівником технічної підтримки.
                 </p>
                 <div className="pt-2 border-t border-yellow-200/50">
                   <p className="mb-1 font-semibold">Для замовлення ліцензії Delivery (CallCenter):</p>
                   <p className="mb-1">Клієнт має бути на підписці "Cloud Enterprise".</p>
                   <p className="mb-1">Для того, щоб перевірити: на якій підписці знаходиться клієнт - достатньо зайти у BackOffice та перевірити наявність ліцензії Delivery (CallCenter):</p>
                   <ul className="list-disc list-inside pl-1 space-y-0.5">
                     <li>якщо її немає = у клієнта Cloud PRO</li>
                     <li>якщо вона є = у клієнта Cloud Enterpise</li>
                   </ul>
                 </div>
               </div>
            </section>
          </div>

          {/* COLUMN 2: Mobile Apps */}
          <div className="space-y-6">
              {/* Section 3: Mobile Apps */}
              <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                   <span>3. Мобільні додатки</span>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">Mobile</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {mobileAddons.map(addon => (
                    <LicenseRow 
                      key={addon.id} 
                      addon={addon}
                      quantity={addonQuantities[addon.id] || 0}
                      deployment={deployment}
                      plan={plan}
                      onChange={(qty) => handleAddonChange(addon.id, qty)}
                    />
                  ))}
                </div>
              </section>
          </div>

          {/* COLUMN 3: Other Licenses */}
          <div className="space-y-6">
              {/* Section 4: Other Licenses */}
              <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                   <span>4. Інші ліцензії та інтеграції</span>
                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">Integration</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {otherAddons.map(addon => (
                    <LicenseRow 
                      key={addon.id} 
                      addon={addon}
                      quantity={addonQuantities[addon.id] || 0}
                      deployment={deployment}
                      plan={plan}
                      onChange={(qty) => handleAddonChange(addon.id, qty)}
                    />
                  ))}
                </div>
              </section>
          </div>

          {/* COLUMN 4: Results - Sticky */}
          <div className="relative">
             <div className="lg:sticky lg:top-24 space-y-4">
                {/* Visual Summary Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Разом до сплати</h3>
                    <div className="flex justify-between items-end mb-2 border-b border-dashed border-gray-200 pb-2">
                        <span className="text-gray-600">Щомісячний платіж</span>
                        <span className="text-2xl font-bold text-gray-900">+{calculation.monthlyUah} грн</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600">Разове впровадження</span>
                        <span className="text-xl font-bold text-gray-900">+{calculation.setupUsd}$</span>
                    </div>
                </div>

                {/* Results Text Area */}
                <section id="results-area" className="bg-gray-800 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Відповідь клієнту</h2>
                    <button 
                      onClick={() => handleCopy(generateMessage())}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors border border-gray-600"
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? 'Скопійовано' : 'Копіювати'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-900 p-4 rounded-lg border border-gray-700 text-gray-300 max-h-[500px] overflow-auto">
                    {generateMessage()}
                  </pre>
                  <div className="mt-4 text-xs text-gray-500">
                    * Перевірте відповідність обраного плану (PRO/Enterprise) до додаткових модулів (CallCenter/Loyalty).
                  </div>
                </section>
             </div>
          </div>

        </div>

      </main>

      {/* Floating Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-8 justify-between w-full sm:w-auto">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Всього / міс</p>
              <p className="text-xl font-bold text-gray-900">+{calculation.monthlyUah} грн</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Впровадження</p>
              <p className="text-xl font-bold text-gray-900">+{calculation.setupUsd}$</p>
            </div>
          </div>
          
          <button
             onClick={() => document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors w-full sm:w-auto text-center"
          >
            Текст
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;