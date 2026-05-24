export interface ValidationRule {
    field: string;
    label: string;
    validator: (value: any) => boolean;
    message?: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    firstInvalidField?: string;
    errors: Record<string, string>;
  }