
import { AddonLicense, FrontPricingTier, FrontLicenseInfo } from './types';

// Data from Page 3 & 4: "4. Розрахунок вартості ліцензій Syrve POS (Front)"
export const FRONT_PRICING_TABLE: FrontPricingTier[] = [
  {
    currentCount: 1, // Moving from 1 to 2
    proMonthlyUah: 1055,
    enterpriseMonthlyUah: 1389,
    setupUsd: 150
  },
  {
    currentCount: 2, // Moving from 2 to 3
    proMonthlyUah: 1572,
    enterpriseMonthlyUah: 2089,
    setupUsd: 150
  },
  {
    currentCount: 3, // Moving from 3 to 4
    proMonthlyUah: 1389,
    enterpriseMonthlyUah: 421, // Strictly from PDF Page 4 top row
    setupUsd: 150
  },
  {
    currentCount: 4, // Moving from 4 to 5+ (Logic handles 4 and greater using this row)
    proMonthlyUah: 1257,
    enterpriseMonthlyUah: 1672,
    setupUsd: 150
  }
];

// Data from Page 2: "2. Ліцензії Syrve, частина перша"
export const FRONT_LICENSES_LIST: FrontLicenseInfo[] = [
  {
    name: 'RMS (Front Fast Food)',
    module: 'Робота Syrve POS у режимі "Фаст-фуд"',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення неможливе'
  },
  {
    name: 'RMS (Front Table Service)',
    module: 'Робота Syrve POS у режимі "Ресторан"',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення неможливе'
  },
  {
    name: 'Delivery (Delivery)',
    module: 'Робота Syrve POS у режимі "Ресторан"',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення неможливе'
  },
  {
    name: 'Delivery (Callcenter)',
    module: 'Робота у BackOffice з доставками у режимі "Call-Center"',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення неможливе'
  },
  {
    name: 'RMS (Front SousChef)',
    module: 'Робота Syrve POS у режимі "Кухонний екран"',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення неможливе'
  },
  {
    name: 'RMS (Kitchen)',
    module: 'Робота Syrve POS у режимі "Документи"',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення неможливе'
  }
];

// Data from Page 4 & 5: "5. Розрахунок вартості інших ліцензій Syrve"
// Supply info taken from Table 3 (Page 3) and Table 5 asterisks (Page 5)
export const ADDON_LICENSES: AddonLicense[] = [
  {
    id: 'waiter',
    name: 'Waiter (Front)',
    originalName: 'Syrve Waiter',
    description: 'Мобільний термінал для офіціанта (Android/iOS). Прийом замовлень біля столика.',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 139,
    setupUsd: 60,
    isPerUser: true
  },
  {
    id: 'driver',
    name: 'DeliveryManFiscal (Mobile)',
    originalName: 'Syrve Driver',
    description: 'Додаток для кур’єрів. Навігація, статуси замовлень, прийом оплати.',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 149,
    setupUsd: 60,
    isPerUser: true
  },
  {
    id: 'dashboard_rms',
    name: 'DashBoard (for RMS)',
    originalName: 'Syrve DashBoard*',
    description: 'Аналітика в реальному часі на смартфоні керівника. (RMS версія).',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 139,
    setupUsd: 60,
    isPerUser: false,
    note: 'Є різновиди цих ліцензій'
  },
  {
    id: 'dashboard_tg',
    name: 'Dashboard Telegram Extension',
    originalName: 'Syrve DashBoard Telegram Extension',
    description: 'Розширення для отримання звітності та аналітики через Telegram бот.',
    supplyCloud: 'дозамовлення по прайсу',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 388,
    setupUsd: 0,
    isPerUser: true
  },
  {
    id: 'connector_kiosk',
    name: 'IntellectStyle.Plugin.Kiosk (Front)',
    originalName: 'Connector for Intellect Style-Kiosk',
    description: 'Конектор для підключення терміналів самообслуговування (Кіосків).',
    supplyCloud: 'дозамовлення по прайсу', // Not in Table 3, assumes default pay
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 455,
    setupUsd: 0,
    isPerUser: true
  },
  {
    id: 'checkout',
    name: 'RMS (CheckOut)',
    originalName: 'CheckOut',
    description: 'Спрощене робоче місце касира/фастфуду.',
    supplyCloud: 'дозамовлення по прайсу', // Not in Table 3, assumes default pay
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 139,
    setupUsd: 0,
    isPerUser: true
  },
  {
    id: 'api_front',
    name: 'API connector',
    originalName: 'API Front',
    description: 'Ліцензія для інтеграції з касовим терміналом (локальні інтеграції).',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 149,
    setupUsd: 0,
    isPerUser: false, 
    note: '10 користувачів'
  },
  {
    id: 'api_rest',
    name: 'API (RestAPI)',
    originalName: 'API Cloud',
    description: 'Хмарний API для інтеграції з сайтами, агрегаторами та додатками.',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 149,
    setupUsd: 0,
    isPerUser: false, 
    note: '10 користувачів'
  },
  {
    id: 'api_payment',
    name: 'FrontPaymentPlugin',
    originalName: 'API Payment',
    description: 'Для підключення банківських терміналів та платіжних систем.',
    supplyCloud: 'включена в підписку',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 149,
    setupUsd: 0,
    isPerUser: false, 
    note: '10 користувачів'
  },
  {
    id: 'loyalty_pro',
    name: 'Card5 (Front)',
    originalName: 'Loyalty (PRO)',
    description: 'Базова бонусна система. Управління гостями та картками.',
    supplyCloud: 'включена в підписку (PRO)',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 834,
    setupUsd: 200, 
    setupIsFrom: true,
    isPerUser: false, 
    note: '2 станції'
  },
  {
    id: 'loyalty_ent',
    name: 'Card5CallCenter',
    originalName: 'Loyalty (Enterprise)',
    description: 'Розширена лояльність + модуль Колл-центру для служби доставки.',
    supplyCloud: 'включена в підписку (Enterprise)',
    supplyLt: 'дозамовлення по прайсу',
    monthlyUah: 1792,
    setupUsd: 200, 
    setupIsFrom: true,
    isPerUser: false, 
    requiresEnterprise: true,
    note: '2 станції'
  }
];

// Mapping for Server License Checker
export const TARGET_LICENSE_IDS: Record<string, string> = {
  '100': 'RMS (Front Fast Food)',
  '400': 'Delivery (Delivery)',
  '1400': 'Delivery (Callcenter)',
  '1200': 'RMS (Front SousChef)',
  '800': 'RMS (Kitchen)',
  '101': 'RMS (Front Table Service)',
  '19007518': 'Waiter (Front)',
  '2301': 'DeliveryManFiscal (Mobile)',
  '2000060600': 'DashBoard (for RMS)',
  '20038106': 'Dashboard Telegram Extension',
  '19011701': 'API connector',
  '2000': 'API (RestAPI)',
  '21016318': 'FrontPaymentPlugin'
};
