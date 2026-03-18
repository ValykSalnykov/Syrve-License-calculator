import { LicenseData, CheckLicenseResponse } from '../types';
import { LICENSE_NAMES } from '../constants';

// Вспомогательная функция для парсинга структуры <k>Key</k><v>Value</v>
const parseMapFromElement = (element: Element): Map<string, Element> => {
    const map = new Map<string, Element>();
    let currentKey: string | null = null;
    
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.tagName === 'k') {
            currentKey = child.textContent;
        } else if (child.tagName === 'v' && currentKey !== null) {
            map.set(currentKey, child);
            currentKey = null;
        }
    }
    return map;
};

const parseStringMapFromElement = (element: Element): Map<string, string> => {
     const map = new Map<string, string>();
     let currentKey: string | null = null;
     
     for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.tagName === 'k') {
            currentKey = child.textContent;
        } else if (child.tagName === 'v' && currentKey !== null) {
            map.set(currentKey, child.textContent || '');
            currentKey = null;
        }
    }
    return map;
}

export const parseLicenseState = (xmlString: string): CheckLicenseResponse => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    if (xmlDoc.querySelector("parsererror")) {
        throw new Error("Error parsing XML response");
    }

    const licenses: LicenseData[] = [];
    const serialNumber = xmlDoc.querySelector("serialNumber")?.textContent || null;
    const licenseStatus = xmlDoc.querySelector("licenseStatus")?.textContent || null;
    let serverType: string | null = null;
    
    const companyName = 
        xmlDoc.querySelector("companyName")?.textContent || 
        xmlDoc.querySelector("ownerName")?.textContent || null;
        
    const crmId = 
        xmlDoc.querySelector("crmOrganizationId")?.textContent || 
        xmlDoc.querySelector("crmId")?.textContent || null;

    const moduleNamesNode = xmlDoc.querySelector("moduleNames");
    let dynamicLicenseNames = new Map<string, string>();
    if (moduleNamesNode) {
        dynamicLicenseNames = parseStringMapFromElement(moduleNamesNode);
    }

    const restrictionsNode = xmlDoc.querySelector("restrictionsByModule");
    
    if (restrictionsNode) {
        const modulesMap = parseMapFromElement(restrictionsNode);
        
        const resolveServerType = (node: Element | undefined): string | null => {
            if (!node) return null;
            const threshold = node.querySelector("threshold")?.textContent?.trim().toLowerCase();
            if (threshold === 'chain') return 'Chain';
            if (threshold === 'default') return 'RMS';
            return 'RMS';
        };

        serverType = resolveServerType(modulesMap.get("1000"));
        if (!serverType) {
            const moduleZeroNode = modulesMap.get("0");
            if (moduleZeroNode) {
                const innerMap = parseMapFromElement(moduleZeroNode);
                serverType = resolveServerType(innerMap.get("1000"));
            }
        }

        modulesMap.forEach((innerMapNode, moduleId) => {
            if (!LICENSE_NAMES[moduleId]) return;

            const innerMap = parseMapFromElement(innerMapNode);
            const connectionRestrictionNode = innerMap.get("2"); // 2 = ConnectionsAndExpirations

            if (connectionRestrictionNode) {
                 const thresholdList = connectionRestrictionNode.querySelectorAll("threshold > list > i");
                 
                 if (thresholdList.length > 0) {
                     const item = thresholdList[0];
                     const countStr = item.querySelector("connectionsCount")?.textContent || "0";
                     const validUntilStr = item.querySelector("to")?.textContent || null;
                     
                     const name = LICENSE_NAMES[moduleId] || dynamicLicenseNames.get(moduleId) || `Unknown License (${moduleId})`;
                     const count = parseInt(countStr, 10);
                     
                     if (count > 0) {
                         licenses.push({
                            id: moduleId,
                            name: name,
                            count: count,
                            validUntil: validUntilStr ? formatXmlDate(validUntilStr) : 'Перманентно'
                         });
                     }
                 }
            }
        });
    } else {
        // Fallback для старых версий
        const potentialLicenses = xmlDoc.getElementsByTagName("license");
        if (potentialLicenses.length > 0) {
             Array.from(potentialLicenses).forEach((node) => {
                const id = node.querySelector("licenseId")?.textContent || node.querySelector("id")?.textContent;
                if (id && LICENSE_NAMES[id]) {
                    const countStr = node.querySelector("limitCount")?.textContent || node.querySelector("count")?.textContent || "0";
                    const dateStr = node.querySelector("dueDate")?.textContent || node.querySelector("validUntil")?.textContent;
                    const name = LICENSE_NAMES[id] || `Unknown License (${id})`;
                    licenses.push({
                        id,
                        name,
                        count: parseInt(countStr, 10),
                        validUntil: dateStr ? formatXmlDate(dateStr) : 'Перманентно'
                    });
                }
            });
        }
    }

    licenses.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return { licenses, serialNumber, licenseStatus, companyName, crmId, serverType };
};

const formatXmlDate = (dateStr: string): string => {
    if (!dateStr) return 'Перманентно';
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ru-RU');
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
};
