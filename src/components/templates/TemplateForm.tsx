import { useState } from 'react';
import { ActionForm } from './ActionForm';

type Action = {
  id: string;
  notes: string;
  weight: string;
  reps: string;
};

type TemplateFormProps = {
  onSave: (template: { id: string; name: string; actions: Action[] }) => void;
  onCancel: () => void;
};

export function TemplateForm({ onSave, onCancel }: TemplateFormProps) {
  const [templateName, setTemplateName] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [showActionForm, setShowActionForm] = useState(false);

  const handleAddAction = (action: Action) => {
    setActions([...actions, action]);
    setShowActionForm(false);
  };

  const handleRemoveAction = (actionId: string) => {
    setActions(actions.filter((action) => action.id !== actionId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    onSave({
      id: Date.now().toString(),
      name: templateName,
      actions,
    });
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>创建模板</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='templateName'
            className='block mb-2 text-sm font-medium'>
            模板名称
          </label>
          <input
            type='text'
            id='templateName'
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className='w-full p-2.5 bg-white/5 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500'
            placeholder='例如：胸部训练、背部训练...'
            required
          />
        </div>

        <div className='mt-6 mb-4'>
          <div className='flex justify-between items-center mb-2'>
            <h3 className='text-lg font-medium'>动作列表</h3>
            <button
              type='button'
              onClick={() => setShowActionForm(true)}
              className='px-3 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700 transition'>
              添加动作
            </button>
          </div>

          {showActionForm && (
            <div className='mb-4 p-4 bg-white/5 rounded-lg border border-gray-700'>
              <ActionForm
                onSave={handleAddAction}
                onCancel={() => setShowActionForm(false)}
              />
            </div>
          )}

          {actions.length === 0 ? (
            <div className='text-center py-6 bg-white/5 rounded-lg'>
              <p className='text-gray-400'>暂无动作</p>
            </div>
          ) : (
            <ul className='space-y-2'>
              {actions.map((action) => (
                <li
                  key={action.id}
                  className='p-3 bg-white/5 rounded-lg flex justify-between items-center'>
                  <div>
                    <div className='font-medium'>{action.notes || '未命名动作'}</div>
                    <div className='text-sm text-gray-400'>
                      重量: {action.weight || '未设置'} | 次数: {action.reps || '未设置'}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleRemoveAction(action.id)}
                    className='text-red-400 hover:text-red-300'>
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex justify-end space-x-4 mt-6'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition'>
            取消
          </button>
          <button
            type='submit'
            disabled={!templateName.trim() || actions.length === 0}
            className='px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed'>
            保存模板
          </button>
        </div>
      </form>
    </div>
  );
}
