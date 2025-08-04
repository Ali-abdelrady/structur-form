
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormSchema, FormTemplate } from '@/types/form';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Building, Calendar, Phone, Mail } from 'lucide-react';

interface FormTemplatesProps {
  onSelectTemplate: (form: FormSchema) => void;
  preserveMultiStep?: boolean;
}

const defaultTemplates: FormTemplate[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Basic contact form with name, email, and message',
    category: 'Contact',
    schema: {
      id: 'contact-template',
      name: 'Contact Form',
      description: 'Get in touch with us',
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          name: 'fullName',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          name: 'email',
          placeholder: 'Enter your email',
          required: true
        },
        {
          id: '3',
          type: 'phone',
          label: 'Phone Number',
          name: 'phone',
          placeholder: 'Enter your phone number',
          required: false
        },
        {
          id: '4',
          type: 'select',
          label: 'Subject',
          name: 'subject',
          placeholder: 'Select a subject',
          required: true,
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Support', value: 'support' },
            { label: 'Sales', value: 'sales' },
            { label: 'Partnership', value: 'partnership' }
          ]
        },
        {
          id: '5',
          type: 'textarea',
          label: 'Message',
          name: 'message',
          placeholder: 'Enter your message',
          required: true
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Registration form for events with dietary preferences',
    category: 'Events',
    schema: {
      id: 'event-template',
      name: 'Event Registration Form',
      description: 'Register for our upcoming event',
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          name: 'fullName',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          name: 'email',
          placeholder: 'Enter your email',
          required: true
        },
        {
          id: '3',
          type: 'radio',
          label: 'Ticket Type',
          name: 'ticketType',
          required: true,
          options: [
            { label: 'Standard Ticket - $50', value: 'standard' },
            { label: 'VIP Ticket - $100', value: 'vip' },
            { label: 'Student Ticket - $25', value: 'student' }
          ]
        },
        {
          id: '4',
          type: 'checkbox',
          label: 'Dietary Restrictions',
          name: 'dietaryRestrictions',
          required: false,
          options: [
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-free', value: 'gluten-free' },
            { label: 'Dairy-free', value: 'dairy-free' }
          ]
        },
        {
          id: '5',
          type: 'textarea',
          label: 'Special Requirements',
          name: 'specialRequirements',
          placeholder: 'Any special requirements or comments?',
          required: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Comprehensive job application form with file upload',
    category: 'HR',
    schema: {
      id: 'job-template',
      name: 'Job Application Form',
      description: 'Apply for open positions',
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          name: 'fullName',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          name: 'email',
          placeholder: 'Enter your email',
          required: true
        },
        {
          id: '3',
          type: 'phone',
          label: 'Phone Number',
          name: 'phone',
          placeholder: 'Enter your phone number',
          required: true
        },
        {
          id: '4',
          type: 'select',
          label: 'Position Applied For',
          name: 'position',
          placeholder: 'Select position',
          required: true,
          options: [
            { label: 'Software Engineer', value: 'software-engineer' },
            { label: 'Product Manager', value: 'product-manager' },
            { label: 'UI/UX Designer', value: 'designer' },
            { label: 'Marketing Specialist', value: 'marketing' }
          ]
        },
        {
          id: '5',
          type: 'number',
          label: 'Years of Experience',
          name: 'experience',
          placeholder: 'Enter years of experience',
          required: true,
          validation: { min: 0, max: 50 }
        },
        {
          id: '6',
          type: 'file',
          label: 'Resume/CV',
          name: 'resume',
          required: true
        },
        {
          id: '7',
          type: 'url',
          label: 'Portfolio/LinkedIn URL',
          name: 'portfolio',
          placeholder: 'https://',
          required: false
        },
        {
          id: '8',
          type: 'textarea',
          label: 'Cover Letter',
          name: 'coverLetter',
          placeholder: 'Tell us why you\'re perfect for this role...',
          required: true
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: 'survey-form',
    name: 'Customer Survey',
    description: 'Customer satisfaction survey with conditional fields',
    category: 'Survey',
    schema: {
      id: 'survey-template',
      name: 'Customer Satisfaction Survey',
      description: 'Help us improve our services',
      fields: [
        {
          id: '1',
          type: 'radio',
          label: 'Overall Satisfaction',
          name: 'satisfaction',
          required: true,
          options: [
            { label: 'Very Satisfied', value: 'very-satisfied' },
            { label: 'Satisfied', value: 'satisfied' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Dissatisfied', value: 'dissatisfied' },
            { label: 'Very Dissatisfied', value: 'very-dissatisfied' }
          ]
        },
        {
          id: '2',
          type: 'textarea',
          label: 'What did we do well?',
          name: 'whatWell',
          placeholder: 'Tell us what you liked...',
          required: false,
          dependencies: [
            { field: '1', value: ['very-satisfied', 'satisfied'], action: 'show' }
          ]
        },
        {
          id: '3',
          type: 'textarea',
          label: 'How can we improve?',
          name: 'howImprove',
          placeholder: 'Tell us how we can do better...',
          required: true,
          dependencies: [
            { field: '1', value: ['neutral', 'dissatisfied', 'very-dissatisfied'], action: 'show' }
          ]
        },
        {
          id: '4',
          type: 'checkbox',
          label: 'Which features do you use most?',
          name: 'features',
          required: false,
          options: [
            { label: 'Dashboard', value: 'dashboard' },
            { label: 'Reports', value: 'reports' },
            { label: 'Analytics', value: 'analytics' },
            { label: 'Integrations', value: 'integrations' }
          ]
        },
        {
          id: '5',
          type: 'radio',
          label: 'Would you recommend us?',
          name: 'recommend',
          required: true,
          options: [
            { label: 'Definitely', value: 'definitely' },
            { label: 'Probably', value: 'probably' },
            { label: 'Not sure', value: 'not-sure' },
            { label: 'Probably not', value: 'probably-not' },
            { label: 'Definitely not', value: 'definitely-not' }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

const FormTemplates = ({ onSelectTemplate, preserveMultiStep = false }: FormTemplatesProps) => {
  const [customTemplates, setCustomTemplates] = useState<FormTemplate[]>([]);

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    setCustomTemplates(savedTemplates);
  }, []);

  const allTemplates = [...defaultTemplates, ...customTemplates];

  const getTemplateIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'contact':
        return Mail;
      case 'events':
        return Calendar;
      case 'hr':
        return Users;
      case 'survey':
        return FileText;
      default:
        return Building;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'contact':
        return 'bg-blue-100 text-blue-800';
      case 'events':
        return 'bg-green-100 text-green-800';
      case 'hr':
        return 'bg-purple-100 text-purple-800';
      case 'survey':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Templates</CardTitle>
        <CardDescription>
          Start with a pre-built template or use your saved templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allTemplates.map((template) => {
          const IconComponent = getTemplateIcon(template.category);
          return (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
              onClick={() => {
                const templateForm = { ...template.schema };
                if (preserveMultiStep) {
                  // Convert template fields to a single step if in multi-step mode
                  templateForm.isMultiStep = true;
                  templateForm.steps = [{
                    id: Date.now().toString(),
                    name: 'Step 1',
                    description: 'Template fields',
                    fields: templateForm.fields
                  }];
                  templateForm.fields = [];
                }
                onSelectTemplate(templateForm);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{template.name}</h3>
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <p className="text-xs text-gray-500">
                      {template.schema.fields.length} fields
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {allTemplates.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No templates available. Create and save forms to see them here.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FormTemplates;
