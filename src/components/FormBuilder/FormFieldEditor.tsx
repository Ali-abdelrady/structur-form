
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/types/form';
import { X, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormFieldEditorProps {
  field: FormField;
  allFields: FormField[];
  onUpdateField: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

const FormFieldEditor = ({ field, allFields, onUpdateField, onClose }: FormFieldEditorProps) => {
  const [activeTab, setActiveTab] = useState('basic');

  const updateOptions = (options: { label: string; value: string }[]) => {
    onUpdateField({ options });
  };

  const addOption = () => {
    const currentOptions = field.options || [];
    updateOptions([
      ...currentOptions,
      { label: `Option ${currentOptions.length + 1}`, value: `option${currentOptions.length + 1}` }
    ]);
  };

  const removeOption = (index: number) => {
    const currentOptions = field.options || [];
    updateOptions(currentOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, key: 'label' | 'value', value: string) => {
    const currentOptions = field.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateOptions(newOptions);
  };

  const updateDependency = (index: number, updates: Partial<FormField['dependencies']>[0]) => {
    const currentDeps = field.dependencies || [];
    const newDeps = [...currentDeps];
    newDeps[index] = { ...newDeps[index], ...updates };
    onUpdateField({ dependencies: newDeps });
  };

  const addDependency = () => {
    const currentDeps = field.dependencies || [];
    onUpdateField({
      dependencies: [
        ...currentDeps,
        { field: '', value: '', action: 'show' as const }
      ]
    });
  };

  const removeDependency = (index: number) => {
    const currentDeps = field.dependencies || [];
    onUpdateField({ dependencies: currentDeps.filter((_, i) => i !== index) });
  };

  // Filter out the current field and ensure we have valid fields with IDs
  const availableFields = allFields.filter(f => f.id !== field.id && f.id && f.id.trim() !== '');

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-80 z-50 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Field Settings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="overflow-y-auto h-full pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="dependencies">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={field.label}
                onChange={(e) => onUpdateField({ label: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={field.placeholder || ''}
                onChange={(e) => onUpdateField({ placeholder: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={field.description || ''}
                onChange={(e) => onUpdateField({ description: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={field.required}
                onCheckedChange={(required) => onUpdateField({ required })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>

            {field.type === 'number' && (
              <>
                <div>
                  <Label htmlFor="min">Minimum Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) => onUpdateField({ 
                      validation: { 
                        ...field.validation, 
                        min: e.target.value ? Number(e.target.value) : undefined 
                      } 
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="max">Maximum Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) => onUpdateField({ 
                      validation: { 
                        ...field.validation, 
                        max: e.target.value ? Number(e.target.value) : undefined 
                      } 
                    })}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4 mt-4">
            {['select', 'radio', 'checkbox'].includes(field.type) ? (
              <>
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button onClick={addOption} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(field.options || []).map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Label"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">This field type doesn't support options.</p>
            )}
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Dependency Rules</Label>
              <Button onClick={addDependency} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </div>
            
            <div className="space-y-4">
              {(field.dependencies || []).map((dep, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    <Select
                      value={dep.field || ''}
                      onValueChange={(value) => updateDependency(index, { 
                        field: value, 
                        value: dep.value, 
                        action: dep.action 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.length > 0 ? (
                          availableFields.map(f => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-fields" disabled>
                            No other fields available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Value to match"
                      value={dep.value as string}
                      onChange={(e) => updateDependency(index, { 
                        field: dep.field, 
                        value: e.target.value, 
                        action: dep.action 
                      })}
                    />

                    <Select
                      value={dep.action}
                      onValueChange={(value) => updateDependency(index, { 
                        field: dep.field, 
                        value: dep.value, 
                        action: value as any 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="show">Show field</SelectItem>
                        <SelectItem value="hide">Hide field</SelectItem>
                        <SelectItem value="require">Make required</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDependency(index)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Rule
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {(!field.dependencies || field.dependencies.length === 0) && (
              <p className="text-gray-500 text-sm">No dependency rules set.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormFieldEditor;
