
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'file' | 'phone' | 'url' | 'password';
  label: string;
  name: string; // key to send data
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  dependencies?: {
    field: string;
    value: string | string[];
    action: 'show' | 'hide' | 'require';
  }[];
  dependsOn?: {
    field: string;
    value: string | boolean;
  };
  isComeFromApi?: boolean;
  endpoint?: string;
  body?: string;
  defaultValue?: any;
  description?: string;
  className?: string;
}

export interface FormStep {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  steps?: FormStep[];
  isMultiStep?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  schema: FormSchema;
  thumbnail?: string;
}
