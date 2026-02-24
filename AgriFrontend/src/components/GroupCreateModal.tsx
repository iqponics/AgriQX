// GroupCreateModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
}

export default function GroupCreateModal({
  users,
  isOpen,
  onClose,
  onCreate,
}: {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, selectedUsers: string[]) => void;
}) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl card text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-amber-400"
                >
                  Create New Group
                </Dialog.Title>

                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border border-purple-500/30 bg-purple-900/20 text-gray-100 placeholder-gray-400 rounded-md mb-4 focus:ring-2 focus:ring-purple-500"
                  />

                  <div className="h-64 overflow-y-auto">
                    {users.map(user => (
                      <label
                        key={user._id}
                        className="flex items-center p-2 hover:bg-purple-900/20 cursor-pointer rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                          className="mr-2"
                        />
                        <span className="text-gray-300">{user.firstname} {user.lastname}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm btn-primary"
                    onClick={() => {
                      onCreate(groupName, selectedUsers);
                      onClose();
                    }}
                  >
                    Create Group
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}