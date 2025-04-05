import { api } from '@/trpc/server';
import { TemplateDetail } from './_components/template-detail';

export default async function TemplatePage({ params }: { params: { templateId: string } }) {
  const templateId = Number(params.templateId);
  void api.template.getById.prefetch({ id: templateId });
  const template = await api.template.getById({ id: templateId });

  return <TemplateDetail template={template} />;
}
