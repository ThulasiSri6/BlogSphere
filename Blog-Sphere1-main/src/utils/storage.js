// Utility functions for localStorage management

export const getUsers = () => {
  const users = localStorage.getItem('blogUsers');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('blogUsers', JSON.stringify(users));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const getBlogs = () => {
  const blogs = localStorage.getItem('blogs');
  return blogs ? JSON.parse(blogs) : [];
};

export const saveBlog = (blog) => {
  const blogs = getBlogs();
  blogs.unshift(blog); // Add to beginning
  localStorage.setItem('blogs', JSON.stringify(blogs));
};

export const updateBlog = (blogId, updatedBlog) => {
  const blogs = getBlogs();
  const index = blogs.findIndex(b => b.id === blogId);
  if (index !== -1) {
    blogs[index] = { ...blogs[index], ...updatedBlog };
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }
};

export const deleteBlog = (blogId) => {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== blogId);
  localStorage.setItem('blogs', JSON.stringify(filtered));
};

export const getLikes = () => {
  const likes = localStorage.getItem('blogLikes');
  return likes ? JSON.parse(likes) : {};
};

export const toggleLike = (blogId, userId) => {
  const likes = getLikes();
  const key = `${blogId}_${userId}`;
  if (likes[key]) {
    delete likes[key];
  } else {
    likes[key] = true;
  }
  localStorage.setItem('blogLikes', JSON.stringify(likes));
  return likes[key] || false;
};

export const isLiked = (blogId, userId) => {
  const likes = getLikes();
  return !!likes[`${blogId}_${userId}`];
};

export const getLikeCount = (blogId) => {
  const likes = getLikes();
  return Object.keys(likes).filter(key => key.startsWith(`${blogId}_`)).length;
};

export const getComments = () => {
  const comments = localStorage.getItem('blogComments');
  return comments ? JSON.parse(comments) : [];
};

export const saveComment = (comment) => {
  const comments = getComments();
  comments.push(comment);
  localStorage.setItem('blogComments', JSON.stringify(comments));
};

export const updateComment = (commentId, updatedComment) => {
  const comments = getComments();
  const index = comments.findIndex(c => c.id === commentId);
  if (index !== -1) {
    comments[index] = { ...comments[index], ...updatedComment };
    localStorage.setItem('blogComments', JSON.stringify(comments));
  }
};

export const deleteComment = (commentId) => {
  const comments = getComments();
  const filtered = comments.filter(c => c.id !== commentId);
  localStorage.setItem('blogComments', JSON.stringify(filtered));
};

export const getCommentsByBlog = (blogId) => {
  const comments = getComments();
  return comments.filter(c => c.blogId === blogId);
};

// Seed function to create 10 sample blogs
export const seedBlogs = () => {
  const existingBlogs = getBlogs();
  if (existingBlogs.length > 0) {
    return; // Don't seed if blogs already exist
  }

  const sampleBlogs = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in 2024',
      category: 'Tech',
      content: `Artificial Intelligence continues to revolutionize industries across the globe. From healthcare to finance, AI is transforming how we work and live. In this comprehensive guide, we'll explore the latest trends, breakthroughs, and what the future holds for AI technology.

Machine learning algorithms are becoming more sophisticated, enabling computers to process and understand complex data patterns. Deep learning, a subset of AI, has shown remarkable progress in image recognition, natural language processing, and autonomous systems.

The integration of AI in everyday applications is no longer a distant dream. Smart assistants, recommendation systems, and predictive analytics are just the beginning. As we move forward, ethical considerations and responsible AI development will play crucial roles in shaping the future of this technology.`,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      author: 'Sarah Johnson',
      authorId: 'author1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Minimalist Design Principles for Modern Websites',
      category: 'Design',
      content: `Minimalism in web design isn't just about using less—it's about using less to achieve more. Clean layouts, ample white space, and purposeful typography create experiences that are both beautiful and functional.

The key principles of minimalist design include:
- Focus on essential elements
- Use of negative space
- Limited color palette
- Clear typography hierarchy
- Intuitive navigation

When done right, minimalist design reduces cognitive load, improves user experience, and creates a timeless aesthetic. This approach has been embraced by leading tech companies and continues to influence modern web design trends.`,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      author: 'Michael Chen',
      authorId: 'author2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: '10 Healthy Morning Habits for a Productive Day',
      category: 'Lifestyle',
      content: `Starting your day right sets the tone for everything that follows. Establishing healthy morning habits can dramatically improve your productivity, mood, and overall well-being.

Here are ten proven morning habits:
1. Wake up at a consistent time
2. Drink a glass of water
3. Practice mindfulness or meditation
4. Exercise or stretch
5. Eat a nutritious breakfast
6. Review your goals for the day
7. Avoid checking your phone immediately
8. Get some natural sunlight
9. Practice gratitude
10. Plan your most important tasks

These habits don't need to be implemented all at once. Start with one or two and gradually build your morning routine. Consistency is key to making these habits stick and seeing real benefits in your daily life.`,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
      author: 'Emily Rodriguez',
      authorId: 'author3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'Exploring the Hidden Gems of Southeast Asia',
      category: 'Travel',
      content: `Southeast Asia is a treasure trove of stunning landscapes, rich cultures, and unforgettable experiences. Beyond the well-trodden tourist paths lie hidden gems waiting to be discovered.

From the pristine beaches of the Philippines to the ancient temples of Myanmar, each destination offers something unique. The region's diverse cuisine, warm hospitality, and affordable travel costs make it an ideal destination for adventurers and budget travelers alike.

Whether you're seeking adventure, relaxation, or cultural immersion, Southeast Asia has it all. This guide will take you through some of the most beautiful and less-crowded destinations that will leave you with memories to last a lifetime.`,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
      author: 'David Kim',
      authorId: 'author4',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'The Art of Homemade Sourdough Bread',
      category: 'Food',
      content: `There's something magical about baking your own sourdough bread. The process of creating a living starter, nurturing it, and transforming simple ingredients into a beautiful, crusty loaf is both science and art.

Sourdough bread has been made for thousands of years, and the technique has been passed down through generations. The natural fermentation process not only creates that distinctive tangy flavor but also makes the bread easier to digest and more nutritious.

This guide will walk you through:
- Creating and maintaining a sourdough starter
- The perfect dough consistency
- Shaping and scoring techniques
- Baking tips for that perfect crust
- Troubleshooting common issues

With patience and practice, you'll be creating bakery-quality sourdough bread in your own kitchen.`,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop',
      author: 'Jessica Martinez',
      authorId: 'author5',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      title: 'Building Mental Resilience: A Complete Guide',
      category: 'Health',
      content: `Mental resilience is the ability to bounce back from adversity, adapt to change, and keep going in the face of challenges. It's not about avoiding stress or difficult situations, but rather developing the capacity to handle them effectively.

Research shows that resilient people share certain characteristics:
- Strong problem-solving skills
- Ability to regulate emotions
- Social support networks
- Sense of purpose and meaning
- Optimistic outlook

Building resilience is a process that involves developing healthy coping strategies, maintaining strong relationships, and cultivating a growth mindset. This comprehensive guide provides practical techniques and exercises to help you build your mental resilience and thrive in challenging times.`,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
      author: 'Robert Taylor',
      authorId: 'author6',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '7',
      title: 'Remote Work: Strategies for Success in 2024',
      category: 'Business',
      content: `Remote work has evolved from a trend to a fundamental shift in how we approach employment. As more companies embrace flexible work arrangements, understanding how to succeed in a remote environment has become essential.

Key strategies for remote work success include:
- Creating a dedicated workspace
- Establishing clear boundaries between work and personal life
- Maintaining regular communication with your team
- Using productivity tools effectively
- Prioritizing self-care and work-life balance

The future of work is flexible, and those who master remote work skills will have a significant advantage. This guide covers everything from setting up your home office to building strong virtual relationships with colleagues.`,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
      author: 'Amanda Wilson',
      authorId: 'author7',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '8',
      title: 'Sustainable Living: Small Changes, Big Impact',
      category: 'Lifestyle',
      content: `Living sustainably doesn't require a complete lifestyle overhaul. Small, consistent changes can make a significant difference for both the environment and your wallet.

Simple sustainable practices include:
- Reducing single-use plastics
- Choosing energy-efficient appliances
- Supporting local and sustainable products
- Reducing food waste
- Using public transportation or cycling
- Composting organic waste

Every action counts, and when multiplied across communities, these small changes create substantial positive impact. This article explores practical ways to incorporate sustainability into your daily routine without feeling overwhelmed.`,
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
      author: 'Lisa Anderson',
      authorId: 'author8',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '9',
      title: 'The Evolution of User Interface Design',
      category: 'Design',
      content: `User interface design has come a long way since the early days of computing. From command-line interfaces to touch screens and voice commands, the way we interact with technology continues to evolve.

Modern UI design focuses on:
- User-centered design principles
- Accessibility and inclusivity
- Responsive and adaptive layouts
- Micro-interactions and animations
- Dark mode and customization options

As technology advances, we're seeing new trends emerge, including augmented reality interfaces, gesture-based controls, and AI-powered personalization. Understanding these trends helps designers create experiences that feel intuitive and delightful.`,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      author: 'James Park',
      authorId: 'author9',
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '10',
      title: 'Blockchain Technology: Beyond Cryptocurrency',
      category: 'Tech',
      content: `While blockchain is often associated with cryptocurrencies, its applications extend far beyond digital currencies. This revolutionary technology offers solutions for supply chain management, healthcare records, voting systems, and more.

Blockchain's key features include:
- Decentralization
- Immutability
- Transparency
- Security through cryptography
- Smart contracts

Industries are exploring blockchain for everything from tracking food safety to managing digital identities. As the technology matures, we're seeing more practical applications that solve real-world problems. This article explores the current state of blockchain technology and its potential future applications.`,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      author: 'Alex Thompson',
      authorId: 'author10',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  localStorage.setItem('blogs', JSON.stringify(sampleBlogs));
};

