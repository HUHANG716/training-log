import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, type RouterOutputs } from '@/trpc/react';
import { DeleteActionButton } from '@/app/(pages)/templates/[templateId]/_components/action/delete-action-button';
import MovementList from './movement-form';

type Props = {
  action: RouterOutputs['action']['getByTemplateId'][number];
  templateId: number;
};

export default function Action({ action, templateId }: Props) {
  if (!action) {
    return <></>;
  }

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
                <DeleteActionButton
                  actionId={action.id}
                  templateId={templateId}
                />
              </div>
            </div>
            <AccordionContent className='pt-4'>
              <div className='space-y-4'>
                {/* 使用封装后的MovementList组件，传递actionId */}
                <Card>
                  <MovementList
                    movements={action.movements}
                    templateId={templateId}
                    actionId={action.id}
                  />
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </CardHeader>
    </Card>
  );
}
