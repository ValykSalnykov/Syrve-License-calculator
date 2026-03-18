import { AddonLicense, FrontPricingTier, FrontLicenseInfo } from './types';
import data from './data.json';

// Data from Page 3 & 4: "4. Розрахунок вартості ліцензій Syrve POS (Front)"
export const FRONT_PRICING_TABLE: FrontPricingTier[] = data.frontPricingTable;

// Data from Page 2: "2. Ліцензії Syrve, частина перша"
export const FRONT_LICENSES_LIST: FrontLicenseInfo[] = data.frontLicensesList;

// Data from Page 4 & 5: "5. Розрахунок вартості інших ліцензій Syrve"
// Supply info taken from Table 3 (Page 3) and Table 5 asterisks (Page 5)
export const ADDON_LICENSES: AddonLicense[] = data.addonLicenses;

export const PROXY_URL = "https://fetching-115008000441.europe-west1.run.app/proxy";
export const PROXY_AUTH_TOKEN = "TEST";
export const SYRVE_AUTH_TOKEN = "Bearer TEST";

export const LICENSE_NAMES: Record<string, string> = {
    '100': 'RMS (Front Fast Food)',
    '101': 'RMS (Front Table Service)',
    '400': 'Delivery (Delivery)',
    '1400': 'Delivery (Callcenter)',
    '1200': 'RMS (Front SousChef)',
    '800': 'RMS (Kitchen)',
    '19007518': 'Waiter (Front)',
    '2301': 'DeliveryManFiscal (Mobile)',
    '2000060600': 'DashBoard (for RMS)',
    '20038106': 'Syrve DashBoard Telegram Extension',
    '19011701': 'API connector',
    '2000': 'API (RestAPI)',
    '21016318': 'FrontPaymentPlugin',
    '21011218': 'Card5 (Front)',
    '21011219': 'Card5CallCenter',
    '2000140600': 'Dashboard (Dashboard Chain 5 rest)',
    '2000150600': 'Dashboard (Dashboard Chain 10 rest)',
    '2000160600': 'Dashboard (Dashboard Chain 50 rest)'
};

export const SYRVE_COMMON_HEADERS = {
    'Content-Type': 'text/xml',
    'Accept-Language': 'ru',
    'X-Resto-CorrelationId': '19d4cc95-d4d6-451f-bbe4-4b40b948c8e4',
    'X-Resto-BackVersion': '0',
    'X-Resto-AuthType': 'BACK',
    'X-Resto-ServerEdition': 'RMS',
    'Authorization': SYRVE_AUTH_TOKEN
};
