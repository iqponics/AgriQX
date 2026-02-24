import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (content: string, image?: File) => void;
  userName: string;
}

export default function CreatePostModal({ onClose, onCreatePost, userName }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreatePost(content, image || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Create Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-500/30">
                <span className="text-amber-400 font-medium">{userName[0]}</span>
              </div>
              <span className="font-medium text-gray-100">{userName}</span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="write something..."
              rows={4}
              className="w-full p-3 border border-purple-500/30 bg-purple-900/20 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="flex items-center gap-2 text-gray-300 hover:text-amber-400"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Add Photo</span>
            </button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {image.name}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 btn-primary"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}