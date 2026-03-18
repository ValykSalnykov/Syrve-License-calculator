import React, { useState } from 'react';
import { ServerConfig, CheckLicenseResponse } from '../types';
import { checkLicenses, checkServerAvailability } from '../services/api';

export const LicenseChecker: React.FC = () => {
  const [config, setConfig] = useState<ServerConfig>({
    host: '',
    port: '443',
    login: 'valentyn_syrve',
    passwordHash: 'a5e430ffc1409e8023cc2906cf31fdd963276c47'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CheckLicenseResponse | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const isAvailable = await checkServerAvailability(config);
      if (!isAvailable) {
        throw new Error("Сервер недоступний");
      }
      const result = await checkLicenses(config);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Помилка перевірки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Перевірка ліцензій Syrve</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Host (IP або домен)</label>
          <input 
            type="text" 
            value={config.host} 
            onChange={e => setConfig({...config, host: e.target.value})}
            className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border text-gray-900"
            placeholder="demo.syrve.live"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Port</label>
          <input 
              type="text" 
              value={config.port} 
              onChange={e => setConfig({...config, port: e.target.value})}
              className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border text-gray-900"
          />
        </div>

        <button 
          onClick={handleCheck}
          disabled={loading || !config.host}
          className="w-full mt-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Завантаження...' : 'Перевірити ліцензії'}
        </button>

        {error && (
          <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="mb-3 space-y-1 text-xs text-gray-600">
                <p><span className="font-semibold text-gray-800">Компанія:</span> {data.companyName || 'Невідомо'}</p>
                <p><span className="font-semibold text-gray-800">Серійний номер:</span> {data.serialNumber || 'Невідомо'}</p>
                <p><span className="font-semibold text-gray-800">Статус:</span> {data.licenseStatus || 'Невідомо'}</p>
                <p><span className="font-semibold text-gray-800">Тип сервера:</span> {data.serverType || 'Невідомо'}</p>
            </div>
            
            <div className="space-y-2 pr-1">
              {data.licenses.map((lic, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded text-xs border border-gray-100">
                  <div className="font-medium text-gray-800">{lic.name}</div>
                  <div className="flex justify-between mt-1 text-gray-500">
                    <span>Кількість: {lic.count}</span>
                    <span>До: {lic.validUntil}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
