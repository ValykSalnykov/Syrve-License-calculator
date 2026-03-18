import { ServerConfig, CheckLicenseResponse } from '../types';
import { PROXY_URL, PROXY_AUTH_TOKEN, SYRVE_COMMON_HEADERS } from '../constants';
import { parseLicenseState } from '../utils/xmlParser';

const getProtocol = (port: string) => (port === '443' ? 'https' : 'http');

const buildUrl = (config: ServerConfig, path: string) => {
    const protocol = getProtocol(config.port);
    const cleanHost = config.host.replace(/\/$/, '');
    return `${protocol}://${cleanHost}:${config.port}${path}`;
};

/**
 * Отправка запроса через Google Cloud Proxy для обхода CORS
 */
const fetchViaProxy = async (targetUrl: string, targetHeaders: any, targetBody: string | null, method: string = "POST") => {
    const proxyPayload = {
        url: targetUrl,
        method: method,
        headers: targetHeaders,
        body: targetBody
    };

    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Authorization': PROXY_AUTH_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proxyPayload)
    });

    if (!response.ok) {
        throw new Error(`Proxy/Server returned ${response.status}: ${response.statusText}`);
    }

    return await response.text();
};

export const checkLicenses = async (config: ServerConfig): Promise<CheckLicenseResponse> => {
    const targetUrl = buildUrl(config, '/resto/services/licensing?methodName=getLicensingState');
    
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<args>
  <entities-version>110348838</entities-version>
  <client-type>BACK</client-type>
  <enable-warnings>false</enable-warnings>
  <client-call-id>19d4cc95-d4d6-451f-bbe4-4b40b948c8e4</client-call-id>
  <license-hash>-1</license-hash>
  <restrictions-state-hash>-1</restrictions-state-hash>
  <obtained-license-connections-ids />
  <request-watchdog-check-results>false</request-watchdog-check-results>
  <use-raw-entities>false</use-raw-entities>
</args>`;

    const targetHeaders = {
        ...SYRVE_COMMON_HEADERS,
        'X-Resto-LoginName': config.login,
        'X-Resto-PasswordHash': config.passwordHash,
    };

    const text = await fetchViaProxy(targetUrl, targetHeaders, xmlBody);
    return parseLicenseState(text);
};

export const updateLicenses = async (config: ServerConfig, serialNumber: string): Promise<string> => {
    const targetUrl = buildUrl(config, '/resto/services/licensing?methodName=fetchAndInstallLicense');

    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<args>
  <entities-version>2</entities-version>
  <client-type>BACK</client-type>
  <enable-warnings>false</enable-warnings>
  <client-call-id>30264dfd-570d-46c0-81b8-6bef9da5a2c9</client-call-id>
  <license-hash>-1938788177</license-hash>
  <restrictions-state-hash>5761</restrictions-state-hash>
  <obtained-license-connections-ids/>
  <request-watchdog-check-results>true</request-watchdog-check-results>
  <use-raw-entities>true</use-raw-entities>
  <serialNumber>${serialNumber}</serialNumber>
</args>`;

    const targetHeaders = {
        'Content-Type': 'text/xml',
        'X-Resto-LoginName': config.login,
        'X-Resto-PasswordHash': config.passwordHash,
        'X-Resto-BackVersion': '0',
        'X-Resto-AuthType': 'BACK',
        'X-Resto-ServerEdition': 'IIKO_RMS',
        'Connection': 'close',
        'Authorization': SYRVE_COMMON_HEADERS.Authorization
    };

    const responseText = await fetchViaProxy(targetUrl, targetHeaders, xmlBody);
    
    if (responseText.includes('<exc>') || responseText.includes('<error>')) {
        const match = responseText.match(/<message>(.*?)<\/message>/) || responseText.match(/<exc>(.*?)<\/exc>/);
        const errorMsg = match ? match[1] : "Неизвестная ошибка сервера";
        throw new Error(`Ошибка при обновлении: ${errorMsg}`);
    }
    
    return responseText;
};

export const checkServerAvailability = async (config: ServerConfig): Promise<boolean> => {
    const targetUrl = buildUrl(config, '/resto');
    try {
        await fetchViaProxy(targetUrl, {}, null, "GET");
        return true;
    } catch (e) {
        return false;
    }
};
