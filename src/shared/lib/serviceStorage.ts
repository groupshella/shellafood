// Service-specific storage manager for booking data
// Each service has its own isolated storage space

export const PICK_ORDER_SERVICE_ID = "pickAndOrder";

export class ServiceStorage {
  // Generate service-specific key
  private static getStorageKey(serviceId: string, key: string): string {
    return `${serviceId}_${key}`;
  }

  // Save booking data for specific service
  static saveBookingData(serviceId: string, data: any): void {
    try {
      const storageKey = this.getStorageKey(serviceId, 'bookingData');
      const sessionKey = this.getStorageKey(serviceId, 'sessionId');
      
      // Create or get session ID
      let sessionId = localStorage.getItem(sessionKey);
      if (!sessionId) {
        sessionId = `${serviceId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(sessionKey, sessionId);
      }
      
      // Save data with timestamp
      const storageData = {
        sessionId,
        timestamp: Date.now(),
        data
      };
      
      localStorage.setItem(storageKey, JSON.stringify(storageData));
    } catch (error) {
      console.error('Error saving booking data:', error);
    }
  }

  // Load booking data for specific service
  static loadBookingData(serviceId: string): any | null {
    try {
      const storageKey = this.getStorageKey(serviceId, 'bookingData');
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;
      
      const storageData = JSON.parse(stored);
      
      // Check if data is too old (24 hours)
      const MAX_AGE = 24 * 60 * 60 * 1000;
      if (Date.now() - storageData.timestamp > MAX_AGE) {
        this.clearBookingData(serviceId);
        return null;
      }
      
      return storageData.data;
    } catch (error) {
      console.error('Error loading booking data:', error);
      return null;
    }
  }

  // Clear booking data for specific service
  static clearBookingData(serviceId: string): void {
    const storageKey = this.getStorageKey(serviceId, 'bookingData');
    const sessionKey = this.getStorageKey(serviceId, 'sessionId');
    
    localStorage.removeItem(storageKey);
    localStorage.removeItem(sessionKey);
  }

  // Start fresh booking for specific service
  static startNewBooking(serviceId: string): void {
    this.clearBookingData(serviceId);
  }

  // Save confirmation data (temporary, in sessionStorage)
  static saveConfirmationData(serviceId: string, data: any): void {
    const key = this.getStorageKey(serviceId, 'confirmation');
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // Load confirmation data (kept until clearAllServiceData or user leaves confirm page)
  static loadConfirmationData(serviceId: string): any | null {
    try {
      const key = this.getStorageKey(serviceId, 'confirmation');
      const stored = sessionStorage.getItem(key);

      if (stored) {
        return JSON.parse(stored);
      }

      return null;
    } catch (error) {
      console.error('Error loading confirmation data:', error);
      return null;
    }
  }

  // Clear all data for a service (use after booking completion)
  static clearAllServiceData(serviceId: string): void {
    this.clearBookingData(serviceId);
    
    // Also clear from sessionStorage
    const confirmKey = this.getStorageKey(serviceId, 'confirmation');
    sessionStorage.removeItem(confirmKey);
  }
}

