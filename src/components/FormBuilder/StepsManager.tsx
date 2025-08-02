import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormStep, FormField } from '@/types/form';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface StepsManagerProps {
  steps: FormStep[];
  isMultiStep: boolean;
  onUpdateSteps: (steps: FormStep[]) => void;
  onToggleMultiStep: (isMultiStep: boolean) => void;
  currentStepId?: string;
  onSelectStep: (stepId: string) => void;
}

const StepsManager = ({ 
  steps, 
  isMultiStep, 
  onUpdateSteps, 
  onToggleMultiStep, 
  currentStepId,
  onSelectStep 
}: StepsManagerProps) => {
  const [newStepName, setNewStepName] = useState('');

  const addStep = () => {
    if (!newStepName.trim()) return;
    
    const newStep: FormStep = {
      id: Date.now().toString(),
      name: newStepName.trim(),
      fields: []
    };
    
    onUpdateSteps([...steps, newStep]);
    setNewStepName('');
  };

  const removeStep = (stepId: string) => {
    onUpdateSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStepName = (stepId: string, name: string) => {
    onUpdateSteps(steps.map(step => 
      step.id === stepId ? { ...step, name } : step
    ));
  };

  const updateStepDescription = (stepId: string, description: string) => {
    onUpdateSteps(steps.map(step => 
      step.id === stepId ? { ...step, description } : step
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isMultiStep}
            onCheckedChange={onToggleMultiStep}
          />
          <Label>Enable Multi-Step Form</Label>
        </div>

        {isMultiStep && (
          <>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                    currentStepId === step.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectStep(step.id)}
                >
                  <span className="text-sm font-medium">Step {index + 1}:</span>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={step.name}
                      onChange={(e) => updateStepName(step.id, e.target.value)}
                      className="h-8"
                      placeholder="Step title"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Textarea
                      value={step.description || ''}
                      onChange={(e) => updateStepDescription(step.id, e.target.value)}
                      className="h-16 text-xs resize-none"
                      placeholder="Step description"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {step.fields.length} fields
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(step.id);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Step name..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStep()}
                className="flex-1"
              />
              <Button onClick={addStep} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {steps.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Add steps to organize your form into multiple pages
              </p>
            )}
          </>
        )}

        {!isMultiStep && (
          <p className="text-sm text-gray-500">
            Single-step form - all fields will be on one page
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StepsManager;