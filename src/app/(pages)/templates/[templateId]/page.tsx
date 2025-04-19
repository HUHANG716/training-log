import { api } from '@/trpc/server';
import { TemplateDetail } from './_components/template-detail';

export default async function TemplatePage({ params }: { params: { templateId: string } }) {
  const templateId = Number(params.templateId);
  const initialData = await api.template.getById({
    id: templateId,
  });

  if (!initialData) {
    return <div>Template not found</div>;
  }

  return <TemplateDetail initialTemplate={initialData} />;
}
