'use client';

import { useForm } from 'react-hook-form';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AddActionFormProps = {
  templateId: number;
};

export function AddActionForm({ templateId }: AddActionFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  // 使用react-hook-form管理动作表单
  const actionForm = useForm({
    defaultValues: {
      name: '',
    },
  });

  const createAction = api.action.create.useMutation({
    onSuccess: async () => {
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

  return (
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
  );
}
