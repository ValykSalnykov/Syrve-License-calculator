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
export const PROXY_AUTH_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2MzBhNzFiZDZlYzFjNjEyNTdhMjdmZjJlZmQ5MTg3MmVjYWIxZjYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE2ODAzMzAyOTEwMTE2MzM2MTU1IiwiZW1haWwiOiJodW1lcjIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibzRKOFhQU1p3VlpvVk1tRUIyYTlQZyIsIm5iZiI6MTc3MDIxNjkyOCwiaWF0IjoxNzcwMjE3MjI4LCJleHAiOjE3NzAyMjA4MjgsImp0aSI6ImY5NTQ4MmQ3NGRjYWE2MDUwY2YzYzkwMWQ5ZWZjYzFhYzY5MzZlMWQifQ.NHiIX5unkkyVw_X_AoLOM77o52b8DO5PD-lCyHUdD7jabApVnh7ngp7KQOce_WLQcN8TGRHsTc_4XEBqamIt8axI26vaIscbyg66LmPwsyNLlR4_UYEKj4pLAeutroWaWtt9u_KIvULhlYzZaKFC7FFJumnPzbfytg6tcjq4kUHQ26cYsNOg_9ILxkhauOdfdDEDMnD5VldeOVQ-zHVUXBfIE06VcOE5IfEDBnzyw_DaLebd_3gZqXyeGv9YxcqObjcJcLYnWgI8eKtVfCQtu_SUzCp5c4uBS1NNDT58GgAGvpP9cNtgJCVnIvYerSICOddhP_uNYCtYv0bGu3hYQQ";
export const SYRVE_AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlMb2dpbklkIjoiMTVhOGQwZWEtNjgwNS00NWJkLTg3MjUtY2JjM2E1YjFmZWVmIiwibmJmIjoxNzcyNjIzNzA1LCJleHAiOjE3NzI2MjczMDUsImlhdCI6MTc3MjYyMzcwNSwiaXNzIjoiU3lydmUiLCJhdWQiOiJjbGllbnRzIn0.SIND5A4UKFu4ra9peopD-3rVtQTuZB6emOogOElTxqA";

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