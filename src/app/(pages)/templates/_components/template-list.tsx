import { api } from '@/trpc/server';
import { TemplateListClient } from './template-list-client';

export async function TemplateList() {
  // 在服务端获取模板数据
  const templates = await api.template.getAll();

  // 将数据传递给客户端组件
  return <TemplateListClient initialTemplates={templates} />;
}
