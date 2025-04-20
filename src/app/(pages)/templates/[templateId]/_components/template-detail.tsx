'use client';

import { useForm } from 'react-hook-form';
import { api, type RouterOutputs } from '@/trpc/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';
import { PlusIcon } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import Action from './action';

// 使用 NonNullable 确保类型不为 null - template.getById 返回单个对象，而不是数组
type Template = NonNullable<RouterOutputs['template']['getById']>;

type Props = {
  // 由于页面组件已经处理了 null 的情况，这里可以假定 initialTemplate 不为 null
  initialTemplate: Template;
};

export function TemplateDetail({ initialTemplate }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const templateId = initialTemplate.id;

  // 使用服务端获取的数据作为初始数据
  const { data: template, isError } = api.template.getById.useQuery(
    { id: templateId },
    {
      initialData: initialTemplate,
    }
  );

  // 使用react-hook-form管理动作表单
  const actionForm = useForm({
    defaultValues: {
      name: '',
    },
  });

  const createAction = api.action.create.useMutation({
    onSuccess: async (data) => {
      actionForm.reset();
      // 刷新模板数据
      await utils.template.getById.invalidate({ id: templateId });
      router.refresh(); // 强制页面刷新以获取最新的服务端数据
      toast.success('动作创建成功');
    },
    onError: (e) => {
      toast.error(`创建失败: ${e.message}`);
    },
  });

  function onSubmitAction(values: { name: string }) {
    createAction.mutate({ name: values.name, templateId });
  }

  // 错误状态处理
  if (isError || !template) {
    return redirect('/templates');
  }

  const actions = template.actions;

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{template.name}</h1>
        <Link href='/templates'>
          <Button variant='outline'>返回模板列表</Button>
        </Link>
      </div>

      <Card className='mb-4 border-dashed'>
        <CardContent>
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
                templateId={templateId}
              />
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
