import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  getBlogs,
  getLikeCount,
  toggleLike,
  isLiked,
  getCommentsByBlog,
  saveComment,
  updateComment,
  deleteComment,
} from '../utils/storage';
import toast from 'react-hot-toast';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    loadBlog();
  }, [id]);

  useEffect(() => {
    if (blog && user) {
      setLiked(isLiked(blog.id, user.id));
      setLikeCount(getLikeCount(blog.id));
      setComments(getCommentsByBlog(blog.id));
      loadRelatedBlogs();
    }
  }, [blog, user]);

  const loadBlog = () => {
    const blogs = getBlogs();
    const foundBlog = blogs.find((b) => b.id === id);
    if (foundBlog) {
      setBlog(foundBlog);
    } else {
      toast.error('Blog not found');
      navigate('/');
    }
  };

  const loadRelatedBlogs = () => {
    const blogs = getBlogs();
    const related = blogs
      .filter((b) => b.id !== blog.id && b.category === blog.category)
      .slice(0, 3);
    setRelatedBlogs(related);
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like posts');
      navigate('/login');
      return;
    }

    const newLiked = toggleLike(blog.id, user.id);
    setLiked(newLiked);
    setLikeCount(getLikeCount(blog.id));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      blogId: blog.id,
      userId: user.id,
      userName: user.name,
      text: commentText,
      date: new Date().toISOString(),
    };

    saveComment(newComment);
    setComments(getCommentsByBlog(blog.id));
    setCommentText('');
    toast.success('Comment added!');
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const handleUpdateComment = (commentId) => {
    if (!editCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    updateComment(commentId, { text: editCommentText });
    setComments(getCommentsByBlog(blog.id));
    setEditingCommentId(null);
    setEditCommentText('');
    toast.success('Comment updated!');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
      setComments(getCommentsByBlog(blog.id));
      toast.success('Comment deleted!');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    setShowShareModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {blog.image && (
            <div className="h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-sm font-semibold text-teal-600 bg-teal-50 rounded-full">
                {blog.category}
              </span>
              <span className="text-sm text-gray-500">{formatDate(blog.date)}</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
                  <span className="font-semibold">{likeCount}</span>
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>🔗</span>
                  <span className="font-semibold">Share</span>
                </motion.button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {blog.content}
              </p>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Post Comment
              </motion.button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Please login to comment</p>
              <Link
                to="/login"
                className="text-teal-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">{comment.userName}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                      </div>
                    </div>
                    {user && user.id === comment.userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id, comment.text)}
                          className="text-sm text-teal-600 hover:text-teal-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="px-4 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentText('');
                          }}
                          className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">{comment.text}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </motion.div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  to={`/blog/${relatedBlog.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {relatedBlog.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-500">{formatDate(relatedBlog.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share this blog</h3>
              <div className="space-y-4">
                <button
                  onClick={copyToClipboard}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Copy Link
                </button>
                <div className="flex gap-4 justify-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Facebook
                  </button>
                  <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
                    Twitter
                  </button>
                  <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                    LinkedIn
                  </button>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetails;

