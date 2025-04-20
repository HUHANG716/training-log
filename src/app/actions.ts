'use server';

import { api } from '@/trpc/server';
import { revalidatePath } from 'next/cache';

export async function createTemplate(preState: any, formData: FormData) {
  const name = formData.get('name') as string;

  try {
    await api.template.create({ name });

    revalidatePath('/templates');
    return {
      message: 'success',
    };
  } catch (error) {
    console.log('asdsd888as');
    console.error(error);
    return {
      message: 'fail',
    };
  }
  //update
}

export async function delTemplate(templateId: number) {
  try {
    await api.template.delete({ id: Number(templateId) });
    console.log(`Template with ID ${templateId} deleted successfully.`);
    revalidatePath('/templates');

    return { message: 'success' };
  } catch (error) {
    console.error(error);
    return {
      message: 'fail',
    };
  }
}
