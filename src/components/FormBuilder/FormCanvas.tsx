
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormSchema, FormField } from '@/types/form';
import FormFieldEditor from './FormFieldEditor';
import { Trash2, Settings, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormCanvasProps {
  form: FormSchema;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onReorderFields: (dragIndex: number, hoverIndex: number) => void;
}

const FormCanvas = ({ form, onUpdateField, onRemoveField, onReorderFields }: FormCanvasProps) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderFields(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleRemoveField = (fieldId: string) => {
    // If the field being removed is currently selected, clear the selection
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    onRemoveField(fieldId);
  };

  // Find the currently selected field
  const selectedField = selectedFieldId ? form.fields.find(f => f.id === selectedFieldId) : null;

  if (form.fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building Your Form</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Add form fields from the left panel to start creating your custom form. You can reorder, edit, and configure each field.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{form.name}</h2>
        {form.description && (
          <p className="text-gray-600 mt-2">{form.description}</p>
        )}
      </div>

      {form.fields.map((field, index) => (
        <Card
          key={field.id}
          className={cn(
            "p-4 transition-all duration-200 cursor-pointer hover:shadow-md",
            selectedFieldId === field.id && "ring-2 ring-blue-500 shadow-md",
            draggedIndex === index && "opacity-50"
          )}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onClick={() => setSelectedFieldId(field.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-800">{field.label}</span>
                  {field.required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {field.type}
                  </span>
                </div>
                
                {field.description && (
                  <p className="text-sm text-gray-600 mb-2">{field.description}</p>
                )}
                
                <div className="text-sm text-gray-500">
                  {field.placeholder && `Placeholder: "${field.placeholder}"`}
                  {field.options && ` • ${field.options.length} options`}
                  {field.dependencies && field.dependencies.length > 0 && 
                    ` • ${field.dependencies.length} dependency rule(s)`}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFieldId(selectedFieldId === field.id ? null : field.id);
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveField(field.id);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {selectedField && (
        <FormFieldEditor
          field={selectedField}
          allFields={form.fields}
          onUpdateField={(updates) => onUpdateField(selectedField.id, updates)}
          onClose={() => setSelectedFieldId(null)}
        />
      )}
    </div>
  );
};

export default FormCanvas;
