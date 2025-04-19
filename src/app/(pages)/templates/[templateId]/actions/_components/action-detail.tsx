'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Shadcn UI 组件
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ActionDetailProps {
  actionId: number;
}

interface MovementFormValues {
  weight: number;
  reps: number;
  note: string;
}

export function ActionDetail({ actionId }: ActionDetailProps) {
  const form = useForm<MovementFormValues>({
    defaultValues: {
      weight: 0,
      reps: 0,
      note: '',
    },
  });

  const utils = api.useUtils();
  const action = api.action.getById.useQuery({ id: actionId });
  const movements = api.movement.getByActionId.useQuery({ actionId });

  const createMovement = api.movement.create.useMutation({
    onSuccess: async () => {
      await utils.movement.getByActionId.invalidate({ actionId });
      toast.success('运动记录添加成功');
      form.reset({
        weight: 0,
        reps: 0,
        note: '',
      });
    },
    onError: (e) => {
      toast.error(`添加失败: ${e.message}`);
    },
  });

  const deleteMovement = api.movement.delete.useMutation({
    onSuccess: async () => {
      await utils.movement.getByActionId.invalidate({ actionId });
      toast.success('运动记录删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });

  const onSubmit = (values: MovementFormValues) => {
    createMovement.mutate({
      ...values,
      actionId,
    });
  };

  if (action.isLoading) return <p className='text-center py-8'>加载动作中...</p>;
  if (action.error) return <p className='text-center py-8 text-destructive'>加载动作出错: {action.error.message}</p>;
  if (!action.data) return <p className='text-center py-8'>未找到动作</p>;

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>{action.data.name}</h1>
          <p className='text-muted-foreground'>模板: {action.data.template.name}</p>
        </div>
        <Link href={`/templates/${action.data.templateId}`}>
          <Button variant='outline'>返回模板</Button>
        </Link>
      </div>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>记录运动</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>重量 (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='重量'
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='reps'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>次数</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='次数'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='备注'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex items-end'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={createMovement.isPending}
                  onClick={form.handleSubmit(onSubmit)}>
                  {createMovement.isPending ? '记录中...' : '记录'}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      <h2 className='text-xl font-semibold mb-4'>动作</h2>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>重量 (kg)</TableHead>
              <TableHead>次数</TableHead>
              <TableHead>备注</TableHead>
              <TableHead className='text-right'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.data?.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.weight}</TableCell>
                <TableCell>{movement.reps}</TableCell>
                <TableCell>{movement.note}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => deleteMovement.mutate({ id: movement.id })}
                    disabled={deleteMovement.isPending}>
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {movements.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center text-muted-foreground'>
                  没有找到运动记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {movements.isLoading && <p className='text-center py-4'>加载运动记录中...</p>}
      {movements.error && <p className='text-center py-4 text-destructive'>加载运动记录出错: {movements.error.message}</p>}
    </div>
  );
}
