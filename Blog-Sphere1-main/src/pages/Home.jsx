import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogs, getLikeCount } from '../utils/storage';
import { getCommentsByBlog } from '../utils/storage';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    const allBlogs = getBlogs();
    setBlogs(allBlogs);
    
    // Set featured blog (most recent)
    if (allBlogs.length > 0) {
      setFeaturedBlog(allBlogs[0]);
    }

    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(allBlogs.map(blog => blog.category))];
    setCategories(uniqueCategories);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Featured Post */}
      {featuredBlog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[500px] overflow-hidden bg-gradient-to-r from-teal-600 to-teal-800"
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {featuredBlog.image && (
            <img
              src={featuredBlog.image}
              alt={featuredBlog.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold bg-teal-500 rounded-full">
                  Featured
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {featuredBlog.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 line-clamp-2">
                  {featuredBlog.content.substring(0, 150)}...
                </p>
                <Link
                  to={`/blog/${featuredBlog.id}`}
                  className="inline-block px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Read More
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          ❤️ {getLikeCount(blog.id)}
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {getCommentsByBlog(blog.id).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No blogs found. Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

