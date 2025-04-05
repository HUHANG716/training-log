'use client';

import { api } from '@/trpc/react';
import Link from 'next/link';
import type { RouterOutputs } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';

type Template = RouterOutputs['template']['getAll'][number];

interface TemplateListClientProps {
  initialTemplates: Template[];
}

export function TemplateListClient({ initialTemplates }: TemplateListClientProps) {
  const utils = api.useUtils();

  // 使用initialTemplates作为初始数据
  const {
    data: templates,
    isLoading,
    error,
  } = api.template.getAll.useQuery(undefined, {
    initialData: initialTemplates,
  });

  const createTemplate = api.template.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.template.getAll.invalidate();
      toast.success('模板创建成功');
    },
    onError: (e) => {
      toast.error(`创建失败: ${e.message}`);
    },
  });

  const deleteTemplate = api.template.delete.useMutation({
    onSuccess: async () => {
      await utils.template.getAll.invalidate();
      toast.success('模板删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });

  // 使用react-hook-form管理表单
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: { name: string }) {
    createTemplate.mutate({ name: values.name });
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold mb-6'>训练模板</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mb-8 flex gap-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex-1 max-w-sm'>
                <FormControl>
                  <Input
                    placeholder='模板名称'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={createTemplate.isPending || !form.watch('name')?.trim()}
            className='shrink-0'>
            {createTemplate.isPending ? '创建中...' : '创建模板'}
          </Button>
        </form>
      </Form>

      <div className='grid grid-cols-2 gap-4'>
        {isLoading ? (
          // 使用Skeleton组件优化加载状态
          Array.from({ length: 2 }).map((_, index) => (
            <Card
              key={index}
              className='overflow-hidden'>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2 mt-2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-1/4' />
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Skeleton className='h-9 w-24' />
                <Skeleton className='h-9 w-16' />
              </CardFooter>
            </Card>
          ))
        ) : error ? (
          <div className='col-span-2 text-center py-8'>
            <p className='text-destructive mb-2'>加载模板出错</p>
            <p className='text-sm text-muted-foreground'>{error.message}</p>
          </div>
        ) : templates?.length === 0 ? (
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
