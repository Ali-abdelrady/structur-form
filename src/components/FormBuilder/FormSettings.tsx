
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSchema } from '@/types/form';

interface FormSettingsProps {
  form: FormSchema;
  onUpdateForm: (form: FormSchema) => void;
}

const FormSettings = ({ form, onUpdateForm }: FormSettingsProps) => {
  const updateForm = (updates: Partial<FormSchema>) => {
    onUpdateForm({
      ...form,
      ...updates,
      updatedAt: new Date()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Settings</CardTitle>
        <CardDescription>
          Configure your form's basic information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="form-name">Form Name</Label>
          <Input
            id="form-name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter form name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="form-description">Description</Label>
          <Textarea
            id="form-description"
            value={form.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Enter form description (optional)"
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Form ID:</strong> {form.id}</p>
            <p><strong>Fields:</strong> {form.fields.length}</p>
            <p><strong>Created:</strong> {form.createdAt.toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {form.updatedAt.toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSettings;
