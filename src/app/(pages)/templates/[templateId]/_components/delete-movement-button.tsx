'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Trash2Icon } from 'lucide-react';

type DeleteMovementProps = {
  movementId: number;
  templateId: number;
};

// 提取删除逻辑到自定义hook
function useDeleteMovement(templateId: number) {
  const utils = api.useUtils();

  return api.movement.delete.useMutation({
    onSuccess: async () => {
      await utils.template.getById.invalidate({ id: templateId });
      toast.success('运动记录删除成功');
    },
    onError: (e) => {
      toast.error(`删除失败: ${e.message}`);
    },
  });
}

export function DeleteMovementButton({ movementId, templateId }: DeleteMovementProps) {
  const deleteMovement = useDeleteMovement(templateId);

  function handleDelete() {
    if (confirm('确定要删除这条运动记录吗？')) {
      deleteMovement.mutate({ id: movementId });
    }
  }

  return (
    <Button
      variant='destructive'
      size='sm'
      onClick={handleDelete}
      disabled={deleteMovement.isPending}>
      <Trash2Icon className='h-4 w-4' />
      {deleteMovement.isPending ? '删除中...' : ''}
    </Button>
  );
}
