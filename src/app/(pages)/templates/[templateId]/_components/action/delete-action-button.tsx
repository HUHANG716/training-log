'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Trash2Icon } from 'lucide-react';

type DeleteActionProps = {
  actionId: number;
  templateId: number;
};

// 提取删除逻辑到自定义hook
function useDeleteAction(templateId: number) {
  const utils = api.useUtils();

  return api.action.delete.useMutation({
    onSuccess: async () => {
      await utils.action.getByTemplateId.invalidate({ templateId });
      toast.success('动作删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });
}

export function DeleteActionButton({ actionId, templateId }: DeleteActionProps) {
  const deleteAction = useDeleteAction(templateId);

  function handleDelete() {
    if (confirm('确定要删除这个动作吗？相关的运动记录也会被删除。')) {
      deleteAction.mutate({ id: actionId });
    }
  }

  return (
    <Button
      variant='destructive'
      size='sm'
      onClick={handleDelete}
      disabled={deleteAction.isPending}>
      <Trash2Icon className='h-4 w-4' />
      {deleteAction.isPending ? '删除中...' : ''}
    </Button>
  );
}
