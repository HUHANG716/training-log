'use client';

import { useState } from 'react';

type ActionFormProps = {
  onSave: (action: { id: string; notes: string; weight: string; reps: string }) => void;
  onCancel: () => void;
};

export function ActionForm({ onSave, onCancel }: ActionFormProps) {
  const [notes, setNotes] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: Date.now().toString(),
      notes,
      weight,
      reps,
    });

    // Reset form
    setNotes('');
    setWeight('');
    setReps('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className='text-lg font-medium mb-3'>添加动作</h4>

      <div className='mb-3'>
        <label
          htmlFor='notes'
          className='block mb-1 text-sm'>
          备注
        </label>
        <input
          type='text'
          id='notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className='w-full p-2 bg-white/5 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500'
          placeholder='例如：卧推、硬拉...'
        />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <label
            htmlFor='weight'
            className='block mb-1 text-sm'>
            重量 (kg)
          </label>
          <input
            type='text'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className='w-full p-2 bg-white/5 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500'
            placeholder='例如: 50'
          />
        </div>

        <div>
          <label
            htmlFor='reps'
            className='block mb-1 text-sm'>
            次数
          </label>
          <input
            type='text'
            id='reps'
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className='w-full p-2 bg-white/5 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500'
            placeholder='例如: 12'
          />
        </div>
      </div>

      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onCancel}
          className='px-3 py-1.5 text-sm bg-gray-600 rounded hover:bg-gray-700 transition'>
          取消
        </button>
        <button
          type='submit'
          className='px-3 py-1.5 text-sm bg-purple-600 rounded hover:bg-purple-700 transition'>
          添加
        </button>
      </div>
    </form>
  );
}
