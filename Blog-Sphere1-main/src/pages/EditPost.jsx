import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogs, updateBlog } from '../utils/storage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    content: '',
    image: null,
    imagePreview: null,
  });

  const categories = ['Tech', 'Design', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to edit posts');
      navigate('/login');
      return;
    }

    const blogs = getBlogs();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      toast.error('Blog not found');
      navigate('/my-posts');
      return;
    }

    if (blog.authorId !== user.id) {
      toast.error('You can only edit your own posts');
      navigate('/my-posts');
      return;
    }

    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: null,
      imagePreview: blog.image,
    });
  }, [id, user, navigate]);

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

    const updatedBlog = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      image: formData.imagePreview,
    };

    updateBlog(id, updatedBlog);
    toast.success('Blog updated successfully!');
    navigate('/my-posts');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>

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
                onClick={() => navigate('/my-posts')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Update Post
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPost;

