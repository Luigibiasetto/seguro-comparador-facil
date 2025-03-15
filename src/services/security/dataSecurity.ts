
/**
 * Simple encryption utility for data security
 * Note: This is a basic implementation and not suitable for production-level security
 */

// Simple XOR-based encryption function (for demonstration purposes)
export function encryptData(data: string, key: string): string {
  let result = '';
  for(let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
}

// Simple XOR-based decryption function (for demonstration purposes)
export function decryptData(encryptedData: string, key: string): string {
  try {
    const decoded = atob(encryptedData); // Base64 decode
    let result = '';
    for(let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return ""; // Return empty string on error
  }
}

// Securely store data in localStorage with encryption
export function secureStore(key: string, data: any, secretKey: string = "comparado-secure-key"): void {
  try {
    const jsonData = JSON.stringify(data);
    const encryptedData = encryptData(jsonData, secretKey);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error("Error storing encrypted data:", error);
  }
}

// Retrieve and decrypt data from localStorage
export function secureRetrieve<T>(key: string, secretKey: string = "comparado-secure-key"): T | null {
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData, secretKey);
    return JSON.parse(decryptedData) as T;
  } catch (error) {
    console.error("Error retrieving encrypted data:", error);
    return null;
  }
}

// Clear secure data
export function secureClear(key: string): void {
  localStorage.removeItem(key);
}

// Mask sensitive data for display (e.g., credit card, phone numbers)
export function maskSensitiveData(data: string, visibleDigits: number = 4): string {
  if (!data || data.length <= visibleDigits) return data;
  
  const visible = data.slice(-visibleDigits);
  const masked = '*'.repeat(data.length - visibleDigits);
  
  return masked + visible;
}
