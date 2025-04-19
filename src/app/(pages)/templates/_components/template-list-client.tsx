'use client';

import { api } from '@/trpc/react';
import Link from 'next/link';
import React, { useState } from 'react';
import type { RouterOutputs } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useViewportStore } from '@/store/viewport';
import { useRouter } from 'next/navigation';

type Template = RouterOutputs['template']['getAll'][number];

interface TemplateListClientProps {
  initialTemplates: Template[];
}

export function TemplateListClient({ initialTemplates }: TemplateListClientProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const { dvh } = useViewportStore();
  const [templateName, setTemplateName] = useState('');

  // 使用服务端获取的数据作为初始数据
  const { data: templates } = api.template.getAll.useQuery(undefined, {
    initialData: initialTemplates,
    enabled: false, // 禁用自动获取
  });

  const createTemplate = api.template.create.useMutation({
    onSuccess: async () => {
      setTemplateName(''); // 重置输入
      await utils.template.getAll.invalidate(); // 刷新模板列表
      router.refresh(); // 强制页面刷新以获取最新的服务端数据
      toast.success('模板创建成功');
    },
    onError: (e) => {
      toast.error(`创建失败: ${e.message}`);
    },
  });

  const deleteTemplate = api.template.delete.useMutation({
    onSuccess: async () => {
      await utils.template.getAll.invalidate();
      router.refresh(); // 强制页面刷新以获取最新的服务端数据
      toast.success('模板删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });

  // 简化的表单提交处理
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (templateName.trim()) {
      createTemplate.mutate({ name: templateName });
    }
  }

  return (
    <div
      className='container mx-auto py-8 px-4 overflow-auto'
      style={{
        height: 100 * dvh,
      }}>
      <h1 className='text-2xl font-bold mb-6'>训练模板</h1>

      {/* 简化的表单 */}
      <form
        onSubmit={handleSubmit}
        className='mb-8 flex gap-2'>
        <Input
          placeholder='模板名称'
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className='flex-1 max-w-sm'
        />
        <Button
          type='submit'
          disabled={createTemplate.isPending || !templateName.trim()}
          className='shrink-0'>
          {createTemplate.isPending ? '创建中...' : '创建模板'}
        </Button>
      </form>

      <div className='grid grid-cols-2 gap-4'>
        {templates.length === 0 ? (
          <div className='col-span-2 text-center py-12'>
            <p className='text-lg mb-2'>没有找到模板</p>
            <p className='text-sm text-muted-foreground mb-4'>创建您的第一个模板开始使用！</p>
          </div>
        ) : (
          // 显示模板列表
          templates.map((template) => (
            <Card
              key={template.id}
              className='overflow-hidden'>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <p className='text-sm text-muted-foreground'>创建于 {new Date(template.createdAt).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>动作: {template.actions.length}</Badge>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Link href={`/templates/${template.id}/`}>
                  <Button
                    variant='outline'
                    size='sm'>
                    查看详情
                  </Button>
                </Link>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => deleteTemplate.mutate({ id: template.id })}
                  disabled={deleteTemplate.isPending}>
                  {deleteTemplate.isPending ? '删除中...' : '删除'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
