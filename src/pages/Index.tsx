
import FormBuilder from '@/components/FormBuilder/FormBuilder';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dynamic Form Builder
          </h1>
          <p className="text-xl text-gray-600">
            Create, customize, and deploy forms with dependent fields and templates
          </p>
        </div>
        <FormBuilder />
      </div>
    </div>
  );
};

export default Index;
