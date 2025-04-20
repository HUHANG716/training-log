import { api } from '@/trpc/server';
import { TemplateDetail } from './_components/template-detail';

// Updated the function signature to match Next.js PageProps interface
export default async function TemplatePage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const initialData = await api.template.getById({
    id: Number(templateId),
  });

  if (!initialData) {
    return <div>Template not found</div>;
  }

  return <TemplateDetail initialTemplate={initialData} />;
}
