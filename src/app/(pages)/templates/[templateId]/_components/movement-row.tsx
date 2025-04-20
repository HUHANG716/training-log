import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { type RouterOutputs } from '@/trpc/react';
import { DeleteMovementButton } from './delete-movement-button';

// 编辑模式的props类型
type EditMovementRowProps = {
  movement: RouterOutputs['action']['getByTemplateId'][number]['movements'][number];
  templateId: number;
  handleChange: (movementId: number, field: 'weight' | 'reps' | 'note', value: string | number) => void;
  handleBlur: (movement: RouterOutputs['action']['getByTemplateId'][number]['movements'][number]) => void;
  mode: 'edit';
};

// 创建模式的props类型
type CreateMovementRowProps = {
  templateId: number;
  actionId: number;
  handleCreate: (data: { weight: number; reps: number; note: string }) => void;
  mode: 'create';
};

// 联合类型
type MovementRowProps = EditMovementRowProps | CreateMovementRowProps;

export function MovementRow(props: MovementRowProps) {
  if (props.mode === 'edit') {
    // 编辑模式
    const { movement, templateId, handleChange, handleBlur } = props;

    return (
      <TableRow key={movement.id}>
        <TableCell>
          <Input
            type='number'
            defaultValue={movement.weight}
            onChange={(e) => handleChange(movement.id, 'weight', e.target.value)}
            onBlur={() => handleBlur(movement)}
          />
        </TableCell>
        <TableCell>
          <Input
            type='number'
            defaultValue={movement.reps}
            onChange={(e) => handleChange(movement.id, 'reps', e.target.value)}
            onBlur={() => handleBlur(movement)}
          />
        </TableCell>
        <TableCell>
          <Input
            type='text'
            defaultValue={movement.note}
            onChange={(e) => handleChange(movement.id, 'note', e.target.value)}
            onBlur={() => handleBlur(movement)}
            className='w-full'
          />
        </TableCell>
        <TableCell className='text-right'>
          <DeleteMovementButton
            movementId={movement.id}
            templateId={templateId}
          />
        </TableCell>
      </TableRow>
    );
  } else {
    // 创建模式
    const { handleCreate } = props;

    // 创建模式下的本地状态，初始值设为空字符串
    const [newMovementData, setNewMovementData] = useState({
      weight: '',
      reps: '',
      note: '',
    });

    // 添加验证状态
    const [isInvalid, setIsInvalid] = useState(false);

    const handleNewDataChange = (field: 'weight' | 'reps' | 'note', value: string | number) => {
      setNewMovementData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 重置错误状态
      if (isInvalid) {
        setIsInvalid(false);
      }
    };

    const handleSubmit = () => {
      // 验证weight和reps不为空且为有效数字
      const weight = Number(newMovementData.weight);
      const reps = Number(newMovementData.reps);

      if (newMovementData.weight === '' || newMovementData.reps === '' || isNaN(weight) || isNaN(reps)) {
        setIsInvalid(true);
        return;
      }

      // 传递数字类型的值
      handleCreate({
        weight: weight,
        reps: reps,
        note: newMovementData.note,
      });

      // 重置表单
      setNewMovementData({ weight: '', reps: '', note: '' });
    };

    return (
      <TableRow className='bg-muted/20'>
        <TableCell>
          <Input
            type='number'
            value={newMovementData.weight}
            onChange={(e) => handleNewDataChange('weight', e.target.value)}
            className={isInvalid && newMovementData.weight === '' ? 'border-red-500' : ''}
          />
        </TableCell>
        <TableCell>
          <Input
            type='number'
            value={newMovementData.reps}
            onChange={(e) => handleNewDataChange('reps', e.target.value)}
            className={isInvalid && newMovementData.reps === '' ? 'border-red-500' : ''}
          />
        </TableCell>
        <TableCell>
          <Input
            type='text'
            value={newMovementData.note}
            onChange={(e) => handleNewDataChange('note', e.target.value)}
          />
        </TableCell>
        <TableCell className='text-right'>
          <Button
            onClick={handleSubmit}
            size='sm'>
            添加
          </Button>
          {isInvalid && <div className='text-xs text-red-500 mt-1'>请填写必填字段</div>}
        </TableCell>
      </TableRow>
    );
  }
}
