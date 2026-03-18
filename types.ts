export enum PlanType {
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum DeploymentType {
  CLOUD = 'CLOUD',
  LT = 'LT'
}

export interface FrontPricingTier {
  currentCount: number; // The number of fronts the client CURRENTLY has
  proMonthlyUah: number;
  enterpriseMonthlyUah: number;
  setupUsd: number;
}

export interface FrontLicenseInfo {
  name: string;
  module: string;
  supplyCloud: string;
  supplyLt: string;
}

export interface AddonLicense {
  id: string;
  name: string;
  originalName: string; // The "Zvychna" name from PDF
  description?: string; // Tooltip text
  supplyCloud: string; // Text for Cloud mode
  supplyLt: string;    // Text for LT mode
  monthlyUah: number;
  setupUsd: number; // For "Free" we use 0
  isPerUser: boolean; // e.g., "1 користувач" vs "3 користувача" vs "2 станції"
  requiresEnterprise?: boolean;
  note?: string;
  setupIsFrom?: boolean; // If setup is "from $200"
}

export interface CalculationResult {
  monthlyIncreaseUah: number;
  oneTimeSetupUsd: number;
  details: string[];
}

export interface ServerConfig {
    host: string;
    port: string;
    login: string;
    passwordHash: string;
}

export interface LicenseData {
    id: string;
    name: string;
    count: number;
    validUntil: string | null;
    isNew?: boolean;
    countDiff?: number;
    isDateChanged?: boolean;
    oldValidUntil?: string | null;
}

export interface CheckLicenseResponse {
    licenses: LicenseData[];
    serialNumber: string | null;
    licenseStatus: string | null;
    companyName: string | null;
    crmId: string | null;
    serverType: string | null;
}