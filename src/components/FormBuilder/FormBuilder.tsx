
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormFieldsPanel from './FormFieldsPanel';
import FormCanvas from './FormCanvas';
import FormPreview from './FormPreview';
import FormTemplates from './FormTemplates';
import FormSettings from './FormSettings';
import { FormSchema, FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Eye, Settings, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormBuilder = () => {
  const [currentForm, setCurrentForm] = useState<FormSchema>({
    id: Date.now().toString(),
    name: 'Untitled Form',
    description: '',
    fields: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const [activeTab, setActiveTab] = useState('builder');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const addField = (field: FormField) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, { ...field, id: Date.now().toString() }],
      updatedAt: new Date()
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      updatedAt: new Date()
    }));
  };

  const removeField = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
      updatedAt: new Date()
    }));
  };

  const reorderFields = (dragIndex: number, hoverIndex: number) => {
    const fields = [...currentForm.fields];
    const draggedField = fields[dragIndex];
    fields.splice(dragIndex, 1);
    fields.splice(hoverIndex, 0, draggedField);
    
    setCurrentForm(prev => ({
      ...prev,
      fields,
      updatedAt: new Date()
    }));
  };

  const exportForm = () => {
    const dataStr = JSON.stringify(currentForm, null, 2);
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
        <div className="lg:col-span-1">
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
            <FormCanvas
              form={currentForm}
              onUpdateField={updateField}
              onRemoveField={removeField}
              onReorderFields={reorderFields}
            />
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
