import { ActionDetail } from '@/app/(pages)/templates/[templateId]/actions/_components/action-detail';

export default function ActionPage({ params }: { params: { actionId: string } }) {
  const actionId = parseInt(params.actionId);
  return <ActionDetail actionId={actionId} />;
}
