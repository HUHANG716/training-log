import { TableCell, TableRow } from '@/components/ui/table';

// 空记录提示组件
export function EmptyMovementRow() {
  return (
    <TableRow>
      <TableCell
        colSpan={4}
        className='text-center text-muted-foreground py-2'>
        没有找到运动记录
      </TableCell>
    </TableRow>
  );
}
