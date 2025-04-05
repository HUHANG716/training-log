import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api, type RouterOutputs } from '@/trpc/react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface MovementFormValues {
  weight: number;
  reps: number;
  note: string;
}

type Props = {
  action: RouterOutputs['action']['getByTemplateId'][number];
};
export default function Action({ action }: Props) {
  if (!action) {
    return <></>;
  }
  const utils = api.useUtils();
  const templateId = Number(useParams<{ templateId: string }>().templateId);
  // 使用react-hook-form管理运动记录表单
  const movementForms = useForm<MovementFormValues>({
    defaultValues: {
      weight: 0,
      reps: 0,
      note: '',
    },
  });
  const createMovement = api.movement.create.useMutation({
    onSuccess: async (data) => {
      movementForms.reset({
        weight: 0,
        reps: 0,
        note: '',
      });
      await utils.action.getByTemplateId.invalidate({ templateId });
      toast.success('运动记录添加成功');
    },
    onError: (e) => {
      toast.error(`添加失败: ${e.message}`);
    },
  });

  const deleteAction = api.action.delete.useMutation({
    onSuccess: async () => {
      await utils.action.getByTemplateId.invalidate({ templateId });
      toast.success('动作删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });
  function onSubmitMovement(values: MovementFormValues, actionId: number) {
    createMovement.mutate({
      ...values,
      actionId,
    });
  }
  const deleteMovement = api.movement.delete.useMutation({
    onSuccess: async () => {
      await utils.action.getByTemplateId.invalidate({ templateId });
      toast.success('运动记录删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });

  return (
    <Card
      key={action.id}
      className='overflow-hidden'>
      <CardHeader className='pb-0'>
        <div className='flex justify-between items-center'>
          <AccordionItem
            value={action.id.toString()}
            className='border-none w-full'>
            <div className='flex justify-between items-center w-full'>
              <AccordionTrigger className='hover:no-underline py-0'>
                <CardTitle>{action.name}</CardTitle>
              </AccordionTrigger>
              <div className='flex gap-2'>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAction.mutate({ id: action.id });
                  }}
                  disabled={deleteAction.isPending}>
                  {deleteAction.isPending ? '删除中...' : '删除'}
                </Button>
              </div>
            </div>
            <AccordionContent className='pt-4'>
              <div className='space-y-4'>
                {/* 运动记录表格 */}
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
                      {/* 运动记录数据行 */}
                      {action.movements.length > 0 ? (
                        action.movements.map((movement) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className='text-center text-muted-foreground py-2'>
                            没有找到运动记录
                          </TableCell>
                        </TableRow>
                      )}
                      {/* 表单行 */}
                      <TableRow className='bg-muted/30 border-dashed'>
                        <TableCell
                          colSpan={4}
                          className='p-0'>
                          <Form {...movementForms}>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                onSubmitMovement(movementForms.getValues(), action.id);
                              }}
                              className='flex w-full items-end'>
                              <div className='flex-1 flex gap-2 p-2'>
                                <FormField
                                  control={movementForms.control}
                                  name='weight'
                                  render={({ field }) => (
                                    <FormItem className='flex-1 space-y-1'>
                                      <FormLabel className='text-xs'>重量 (kg)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='number'
                                          step='0.01'
                                          placeholder='重量'
                                          {...field}
                                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                          className='h-8'
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={movementForms.control}
                                  name='reps'
                                  render={({ field }) => (
                                    <FormItem className='flex-1 space-y-1'>
                                      <FormLabel className='text-xs'>次数</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='number'
                                          placeholder='次数'
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                                          className='h-8'
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={movementForms.control}
                                  name='note'
                                  render={({ field }) => (
                                    <FormItem className='flex-1 space-y-1'>
                                      <FormLabel className='text-xs'>备注</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder='备注'
                                          {...field}
                                          className='h-8'
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className='p-2'>
                                <Button
                                  type='submit'
                                  size='sm'
                                  disabled={createMovement.isPending}>
                                  {createMovement.isPending ? '记录中...' : '记录'}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>运动记录: {action.movements.length}</p>
      </CardContent>
    </Card>
  );
}
