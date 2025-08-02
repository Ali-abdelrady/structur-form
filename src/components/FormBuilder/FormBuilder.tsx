
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormFieldsPanel from './FormFieldsPanel';
import FormCanvas from './FormCanvas';
import FormPreview from './FormPreview';
import FormTemplates from './FormTemplates';
import FormSettings from './FormSettings';
import StepsManager from './StepsManager';
import { FormSchema, FormField, FormStep } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Eye, Settings, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormBuilder = () => {
  const [currentForm, setCurrentForm] = useState<FormSchema>({
    id: Date.now().toString(),
    name: 'Untitled Form',
    description: '',
    fields: [],
    steps: [],
    isMultiStep: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState('builder');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const addField = (field: FormField) => {
    const newField = { ...field, id: Date.now().toString() };
    
    setCurrentForm(prev => {
      if (prev.isMultiStep && currentStepId && prev.steps) {
        // Add to specific step
        const updatedSteps = prev.steps.map(step =>
          step.id === currentStepId
            ? { ...step, fields: [...step.fields, newField] }
            : step
        );
        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        // Add to main fields array
        return {
          ...prev,
          fields: [...prev.fields, newField],
          updatedAt: new Date()
        };
      }
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => {
      if (prev.isMultiStep && prev.steps) {
        const updatedSteps = prev.steps.map(step => ({
          ...step,
          fields: step.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          )
        }));
        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        return {
          ...prev,
          fields: prev.fields.map(field => 
            field.id === fieldId ? { ...field, ...updates } : field
          ),
          updatedAt: new Date()
        };
      }
    });
  };

  const removeField = (fieldId: string) => {
    setCurrentForm(prev => {
      if (prev.isMultiStep && prev.steps) {
        const updatedSteps = prev.steps.map(step => ({
          ...step,
          fields: step.fields.filter(field => field.id !== fieldId)
        }));
        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        return {
          ...prev,
          fields: prev.fields.filter(field => field.id !== fieldId),
          updatedAt: new Date()
        };
      }
    });
  };

  const reorderFields = (dragIndex: number, hoverIndex: number) => {
    setCurrentForm(prev => {
      if (prev.isMultiStep && currentStepId && prev.steps) {
        const currentStep = prev.steps.find(step => step.id === currentStepId);
        if (!currentStep) return prev;
        
        const fields = [...currentStep.fields];
        const draggedField = fields[dragIndex];
        fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, draggedField);
        
        const updatedSteps = prev.steps.map(step =>
          step.id === currentStepId ? { ...step, fields } : step
        );
        
        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        const fields = [...prev.fields];
        const draggedField = fields[dragIndex];
        fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, draggedField);
        
        return {
          ...prev,
          fields,
          updatedAt: new Date()
        };
      }
    });
  };

  const exportForm = () => {
    // Convert to the new format
    const exportData: any = {
      form: {
        title: currentForm.name,
        description: currentForm.description || ''
      }
    };
    
    if (currentForm.isMultiStep && currentForm.steps) {
      // Multi-step form
      currentForm.steps.forEach((step, index) => {
        const stepFields = [
          {
            title: step.name,
            description: step.description || ''
          },
          ...step.fields.map(field => ({
            label: field.label,
            type: field.type,
            placeholder: field.placeholder || '',
            validation: field.validation || {},
            dependsOn: field.dependencies ? {
              field: field.dependencies[0]?.field || '',
              value: field.dependencies[0]?.value || '',
              action: field.dependencies[0]?.action || 'show'
            } : {}
          }))
        ];
        exportData[`step${index + 1}`] = stepFields;
      });
    } else {
      // Single step form
      exportData.step1 = [
        {
          title: currentForm.name,
          description: currentForm.description || ''
        },
        ...currentForm.fields.map(field => ({
          label: field.label,
          type: field.type,
          placeholder: field.placeholder || '',
          validation: field.validation || {},
          dependsOn: field.dependencies ? {
            field: field.dependencies[0]?.field || '',
            value: field.dependencies[0]?.value || '',
            action: field.dependencies[0]?.action || 'show'
          } : {}
        }))
      ];
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentForm.name.replace(/\s+/g, '_')}_form.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Form Exported",
      description: "Your form has been exported successfully!",
    });
  };

  const importForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedForm = JSON.parse(e.target?.result as string);
        setCurrentForm({
          ...importedForm,
          id: Date.now().toString(),
          createdAt: new Date(importedForm.createdAt),
          updatedAt: new Date()
        });
        toast({
          title: "Form Imported",
          description: "Your form has been imported successfully!",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import form. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const updateSteps = (steps: FormStep[]) => {
    setCurrentForm(prev => ({
      ...prev,
      steps,
      updatedAt: new Date()
    }));
  };

  const toggleMultiStep = (isMultiStep: boolean) => {
    setCurrentForm(prev => {
      if (isMultiStep && prev.fields.length > 0) {
        // Convert existing fields to first step
        const firstStep: FormStep = {
          id: Date.now().toString(),
          name: 'Step 1',
          fields: [...prev.fields]
        };
        return {
          ...prev,
          isMultiStep: true,
          steps: [firstStep],
          fields: [],
          updatedAt: new Date()
        };
      } else if (!isMultiStep && prev.steps && prev.steps.length > 0) {
        // Convert all step fields back to main fields array
        const allFields = prev.steps.flatMap(step => step.fields);
        return {
          ...prev,
          isMultiStep: false,
          steps: [],
          fields: allFields,
          updatedAt: new Date()
        };
      }
      return {
        ...prev,
        isMultiStep,
        steps: isMultiStep ? [] : undefined,
        updatedAt: new Date()
      };
    });
    setCurrentStepId(null);
  };

  const saveTemplate = () => {
    const templates = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    const template = {
      id: Date.now().toString(),
      name: currentForm.name,
      description: currentForm.description || 'Custom template',
      category: 'Custom',
      schema: currentForm
    };
    
    templates.push(template);
    localStorage.setItem('formTemplates', JSON.stringify(templates));
    
    toast({
      title: "Template Saved",
      description: "Your form has been saved as a template!",
    });
  };

  // Get current form data for canvas
  const getCurrentFormData = () => {
    if (currentForm.isMultiStep && currentStepId && currentForm.steps) {
      const currentStep = currentForm.steps.find(step => step.id === currentStepId);
      return {
        ...currentForm,
        fields: currentStep?.fields || []
      };
    }
    return currentForm;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={saveTemplate} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
          <Button onClick={exportForm} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importForm}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>
        </div>
        
        <Button
          onClick={() => setShowPreview(!showPreview)}
          className={`transition-colors ${showPreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <StepsManager
            steps={currentForm.steps || []}
            isMultiStep={currentForm.isMultiStep || false}
            onUpdateSteps={updateSteps}
            onToggleMultiStep={toggleMultiStep}
            currentStepId={currentStepId}
            onSelectStep={setCurrentStepId}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fields" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                Fields
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs">
                Templates
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="mt-4">
              <FormFieldsPanel onAddField={addField} />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-4">
              <FormTemplates onSelectTemplate={setCurrentForm} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <FormSettings form={currentForm} onUpdateForm={setCurrentForm} />
            </TabsContent>
          </Tabs>
        </div>

        <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <Card className="p-6 min-h-[600px]">
            {currentForm.isMultiStep && (!currentStepId || !currentForm.steps?.find(s => s.id === currentStepId)) ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Step</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Choose a step from the steps panel to start adding fields to it.
                </p>
              </div>
            ) : (
              <FormCanvas
                form={getCurrentFormData()}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onReorderFields={reorderFields}
              />
            )}
          </Card>
        </div>

        {showPreview && (
          <div className="lg:col-span-1">
            <Card className="p-6 min-h-[600px]">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <FormPreview form={currentForm} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
