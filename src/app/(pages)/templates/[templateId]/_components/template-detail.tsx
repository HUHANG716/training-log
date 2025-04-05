'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import type { RouterOutputs } from '@/trpc/react';
import Action from './action';

type TemplateQueryResult = RouterOutputs['template']['getById'];

type Props = {
  template: TemplateQueryResult;
};
export function TemplateDetail({ template }: Props) {
  if (!template) {
    return redirect('/templates');
  }
  const utils = api.useUtils();
  const templateId = Number(useParams<{ templateId: string }>().templateId);
  const actions = template.actions;

  // 使用react-hook-form管理动作表单
  const actionForm = useForm({
    defaultValues: {
      name: '',
    },
  });

  const createAction = api.action.create.useMutation({
    onSuccess: async (data) => {
      actionForm.reset();
      await utils.action.getByTemplateId.invalidate({ templateId });
      toast.success('动作创建成功');
    },
    onError: (e) => {
      toast.error(`创建失败: ${e.message}`);
    },
  });

  function onSubmitAction(values: { name: string }) {
    createAction.mutate({ name: values.name, templateId });
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{template.name}</h1>
        <Link href='/templates'>
          <Button variant='outline'>返回模板列表</Button>
        </Link>
      </div>

      <Card className='mb-4 border-dashed'>
        <CardContent className='pt-6'>
          <Form {...actionForm}>
            <form
              onSubmit={actionForm.handleSubmit(onSubmitAction)}
              className='flex gap-2 items-center'>
              <FormField
                control={actionForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder='新动作名称'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                size='sm'
                disabled={createAction.isPending || !actionForm.watch('name')?.trim()}
                className='shrink-0'>
                <PlusIcon className='h-4 w-4 mr-1' />
                {createAction.isPending ? '添加中...' : '添加'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {actions.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-lg mb-2'>没有找到动作</p>
            <p className='text-sm text-muted-foreground mb-4'>添加您的第一个动作开始使用！</p>
          </div>
        ) : (
          // 显示动作列表
          <Accordion
            type='multiple'
            className='space-y-4'>
            {actions.map((action) => (
              <Action
                key={action.id}
                action={action}
              />
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
