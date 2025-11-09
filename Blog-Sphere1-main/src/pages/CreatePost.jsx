import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveBlog } from '../utils/storage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    content: '',
    image: null,
    imagePreview: null,
  });
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['Tech', 'Design', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to create a blog');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imagePreview: imageUrl,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBlog = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      content: formData.content,
      image: formData.imagePreview,
      author: user.name,
      authorId: user.id,
      date: new Date().toISOString(),
    };

    saveBlog(newBlog);
    toast.success('Blog created successfully!');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {formData.imagePreview && (
                <div className="mt-4">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                {showPreview ? 'Hide Preview' : 'Preview Post'}
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Publish Post
              </motion.button>
            </div>
          </form>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-teal-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                />
              )}
              <div className="mb-2">
                <span className="px-3 py-1 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full">
                  {formData.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{formData.content}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;

