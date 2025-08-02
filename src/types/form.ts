
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'file' | 'phone' | 'url' | 'password';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
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
