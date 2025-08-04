
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/types/form';
import { 
  Type, 
  Mail, 
  Hash, 
  List, 
  CheckSquare, 
  Radio, 
  FileText, 
  Calendar,
  Upload,
  Phone,
  Link,
  Lock
} from 'lucide-react';

interface FormFieldsPanelProps {
  onAddField: (field: FormField) => void;
}

const fieldTypes = [
  {
    type: 'text' as const,
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input',
    defaultField: {
      type: 'text' as const,
      label: 'Text Field',
      name: 'textField',
      placeholder: 'Enter text...',
      required: false
    }
  },
  {
    type: 'email' as const,
    label: 'Email',
    icon: Mail,
    description: 'Email address input',
    defaultField: {
      type: 'email' as const,
      label: 'Email Address',
      name: 'emailAddress',
      placeholder: 'Enter email...',
      required: false
    }
  },
  {
    type: 'number' as const,
    label: 'Number',
    icon: Hash,
    description: 'Numeric input field',
    defaultField: {
      type: 'number' as const,
      label: 'Number Field',
      name: 'numberField',
      placeholder: 'Enter number...',
      required: false
    }
  },
  {
    type: 'password' as const,
    label: 'Password',
    icon: Lock,
    description: 'Password input field',
    defaultField: {
      type: 'password' as const,
      label: 'Password',
      name: 'password',
      placeholder: 'Enter password...',
      required: false
    }
  },
  {
    type: 'phone' as const,
    label: 'Phone',
    icon: Phone,
    description: 'Phone number input',
    defaultField: {
      type: 'phone' as const,
      label: 'Phone Number',
      name: 'phoneNumber',
      placeholder: 'Enter phone number...',
      required: false
    }
  },
  {
    type: 'url' as const,
    label: 'URL',
    icon: Link,
    description: 'Website URL input',
    defaultField: {
      type: 'url' as const,
      label: 'Website URL',
      name: 'websiteUrl',
      placeholder: 'https://...',
      required: false
    }
  },
  {
    type: 'textarea' as const,
    label: 'Textarea',
    icon: FileText,
    description: 'Multi-line text input',
    defaultField: {
      type: 'textarea' as const,
      label: 'Text Area',
      name: 'textArea',
      placeholder: 'Enter detailed text...',
      required: false
    }
  },
  {
    type: 'select' as const,
    label: 'Select Dropdown',
    icon: List,
    description: 'Dropdown selection',
    defaultField: {
      type: 'select' as const,
      label: 'Select Option',
      name: 'selectOption',
      placeholder: 'Choose an option...',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    }
  },
  {
    type: 'radio' as const,
    label: 'Radio Buttons',
    icon: Radio,
    description: 'Single choice selection',
    defaultField: {
      type: 'radio' as const,
      label: 'Radio Selection',
      name: 'radioSelection',
      required: false,
      options: [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' },
        { label: 'Option C', value: 'optionC' }
      ]
    }
  },
  {
    type: 'checkbox' as const,
    label: 'Checkboxes',
    icon: CheckSquare,
    description: 'Multiple choice selection',
    defaultField: {
      type: 'checkbox' as const,
      label: 'Checkbox Selection',
      name: 'checkboxSelection',
      required: false,
      options: [
        { label: 'Choice 1', value: 'choice1' },
        { label: 'Choice 2', value: 'choice2' },
        { label: 'Choice 3', value: 'choice3' }
      ]
    }
  },
  {
    type: 'date' as const,
    label: 'Date Picker',
    icon: Calendar,
    description: 'Date selection',
    defaultField: {
      type: 'date' as const,
      label: 'Date Field',
      name: 'dateField',
      required: false
    }
  },
  {
    type: 'file' as const,
    label: 'File Upload',
    icon: Upload,
    description: 'File upload input',
    defaultField: {
      type: 'file' as const,
      label: 'File Upload',
      name: 'fileUpload',
      required: false
    }
  }
];

const FormFieldsPanel = ({ onAddField }: FormFieldsPanelProps) => {
  const handleAddField = (fieldType: typeof fieldTypes[0]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      ...fieldType.defaultField
    };
    onAddField(newField);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Form Fields</CardTitle>
        <CardDescription>
          Drag and drop fields to build your form
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fieldTypes.map((fieldType) => {
          const IconComponent = fieldType.icon;
          return (
            <Button
              key={fieldType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200 transition-all"
              onClick={() => handleAddField(fieldType)}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{fieldType.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {fieldType.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FormFieldsPanel;
