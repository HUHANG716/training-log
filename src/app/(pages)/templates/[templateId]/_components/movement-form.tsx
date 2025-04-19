import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type RouterOutputs } from '@/trpc/react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { MovementRow } from './movement-row';
import { EmptyMovementRow } from './empty-movement-row';

type Movement = RouterOutputs['action']['getByTemplateId'][number]['movements'][number];
type MovementProps = {
  movements: Movement[];
  templateId: number;
  actionId: number;
};

// 提取运动记录编辑逻辑到自定义 hook
function useMovementEditing() {
  const [editValues, setEditValues] = useState<Record<number, { weight?: number; reps?: number; note?: string }>>({});
  const updateMovement = api.movement.update.useMutation();

  const handleChange = (movementId: number, field: 'weight' | 'reps' | 'note', value: string | number) => {
    setEditValues((prev) => ({
      ...prev,
      [movementId]: {
        ...prev[movementId],
        [field]: field === 'note' ? value : Number(value),
      },
    }));
  };

  const handleBlur = (movement: Movement) => {
    // Only update if values changed
    const changes = editValues[movement.id];
    if (!changes) return;

    const dataToUpdate = {
      id: movement.id,
      weight: changes.weight !== undefined ? changes.weight : movement.weight,
      reps: changes.reps !== undefined ? changes.reps : movement.reps,
      note: changes.note !== undefined ? String(changes.note) : movement.note,
    };

    updateMovement.mutate(dataToUpdate);

    // Clear the edited state for this movement
    setEditValues((prev) => {
      const newState = { ...prev };
      delete newState[movement.id];
      return newState;
    });
  };

  return { handleChange, handleBlur };
}

export default function MovementList({ movements, templateId, actionId }: MovementProps) {
  const { handleChange, handleBlur } = useMovementEditing();
  const utils = api.useUtils();

  // 创建新的运动记录
  const createMovement = api.movement.create.useMutation({
    onSuccess: async () => {
      await utils.template.getById.invalidate({
        id: templateId,
      });

      toast.success('运动记录添加成功');
    },
    onError: (e) => {
      toast.error(`添加失败: ${e.message}`);
    },
  });

  const handleCreate = (data: { weight: number; reps: number; note: string }) => {
    createMovement.mutate({
      ...data,
      actionId,
    });
  };

  return (
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
        {/* 现有运动记录 */}
        {movements.length > 0 ? (
          movements.map((movement) => (
            <MovementRow
              key={movement.id}
              mode='edit'
              movement={movement}
              templateId={templateId}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          ))
        ) : (
          <EmptyMovementRow />
        )}

        {/* 添加新记录的行 */}
        <MovementRow
          mode='create'
          templateId={templateId}
          actionId={actionId}
          handleCreate={handleCreate}
        />
      </TableBody>
    </Table>
  );
}
