
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema, FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FormPreviewProps {
  form: FormSchema;
}

const FormPreview = ({ form }: FormPreviewProps) => {
  const [formData, setFormData] = useState<any>({});
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Create dynamic schema based on form fields
  const createSchema = () => {
    const schemaObject: any = {};
    
    form.fields.forEach(field => {
      let fieldSchema: any;
      
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
          fieldSchema = z.number({
            invalid_type_error: 'Must be a number'
          });
          if (field.validation?.min) fieldSchema = fieldSchema.min(field.validation.min);
          if (field.validation?.max) fieldSchema = fieldSchema.max(field.validation.max);
          break;
        case 'url':
          fieldSchema = z.string().url('Invalid URL');
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string());
          break;
        case 'date':
          fieldSchema = z.date({
            invalid_type_error: 'Invalid date'
          });
          break;
        default:
          fieldSchema = z.string();
      }
      
      if (field.required && !field.dependencies?.some(dep => dep.action === 'require')) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      } else if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaObject[field.id] = fieldSchema;
    });
    
    return z.object(schemaObject);
  };

  const schema = createSchema();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Handle field dependencies
  useEffect(() => {
    const newVisibleFields = new Set<string>();
    
    form.fields.forEach(field => {
      let isVisible = true;
      let shouldRequire = field.required;
      
      if (field.dependencies) {
        field.dependencies.forEach(dep => {
          const depValue = watchedValues[dep.field];
          const matches = Array.isArray(dep.value) 
            ? dep.value.includes(depValue)
            : depValue === dep.value;
            
          if (matches) {
            switch (dep.action) {
              case 'show':
                isVisible = true;
                break;
              case 'hide':
                isVisible = false;
                break;
              case 'require':
                shouldRequire = true;
                break;
            }
          }
        });
      }
      
      if (isVisible) {
        newVisibleFields.add(field.id);
      }
    });
    
    setVisibleFields(newVisibleFields);
  }, [watchedValues, form.fields]);

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    toast({
      title: "Form Submitted!",
      description: "Check the console for form data.",
    });
  };

  const renderField = (field: FormField) => {
    if (!visibleFields.has(field.id)) return null;

    const commonProps = {
      id: field.id,
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
      case 'password':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type={field.type}
              {...register(field.id)}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type="number"
              {...register(field.id, { valueAsNumber: true })}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Textarea
              {...commonProps}
              {...register(field.id)}
              rows={4}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Select onValueChange={(value) => setValue(field.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <RadioGroup onValueChange={(value) => setValue(field.id, value)}>
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    onCheckedChange={(checked) => {
                      const currentValues = watchedValues[field.id] || [];
                      if (checked) {
                        setValue(field.id, [...currentValues, option.value]);
                      } else {
                        setValue(field.id, currentValues.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedValues[field.id] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValues[field.id] ? format(watchedValues[field.id], "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedValues[field.id]}
                  onSelect={(date) => setValue(field.id, date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type="file"
              {...register(field.id)}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (form.fields.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>Add fields to see the preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">{form.name}</h3>
        {form.description && (
          <p className="text-gray-600 mt-1">{form.description}</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {form.fields.map(renderField)}
        
        <Button type="submit" className="w-full mt-6">
          Submit Form
        </Button>
      </form>
    </div>
  );
};

export default FormPreview;
