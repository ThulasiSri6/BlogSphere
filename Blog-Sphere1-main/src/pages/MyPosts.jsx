import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogs, deleteBlog } from '../utils/storage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MyPosts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your posts');
      navigate('/login');
      return;
    }
    loadMyBlogs();
  }, [user, navigate]);

  const loadMyBlogs = () => {
    const blogs = getBlogs();
    const filtered = blogs.filter((blog) => blog.authorId === user?.id);
    setMyBlogs(filtered);
  };

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(blogId);
      loadMyBlogs();
      toast.success('Blog deleted successfully!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
          <Link
            to="/create"
            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Create New Post
          </Link>
        </div>

        {myBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/blog/${blog.id}`}>
                  {blog.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full">
                        {blog.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(blog.date)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                </Link>
                <div className="px-6 pb-6 flex gap-2">
                  <Link
                    to={`/edit/${blog.id}`}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-center font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(blog.id);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-500 text-lg mb-4">You haven't created any posts yet.</p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;

