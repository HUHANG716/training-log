import { Suspense } from 'react';
import { TemplateList } from './_components/template-list';

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateList />
    </Suspense>
  );
}
