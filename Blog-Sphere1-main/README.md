# BlogSphere - Beautiful Blog Website

A modern, interactive blog website built with React.js, inspired by Zoho Blog's elegant design. Features user authentication, blog creation, likes, comments, and sharing functionality.

## Features

### 🏠 Home Page
- Hero banner with featured post
- Grid/list view of blog posts with images
- Search functionality
- Category filtering
- Like and comment counts on each card
- Smooth animations with Framer Motion

### 📝 Create Post Page
- Rich blog creation form
- Category selection
- Image upload with preview
- Preview before publishing
- Authentication required

### 💬 Blog Details Page
- Full blog content display
- Like/unlike functionality
- Comment system (add, edit, delete)
- Share modal with copy link and social sharing
- Related blogs section

### 👤 Authentication
- User signup with validation
- User login
- Logout functionality
- Session management with localStorage

### ⚙️ Additional Features
- My Posts page to view/edit/delete your blogs
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Beautiful UI with Tailwind CSS
- Smooth animations and transitions

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **react-hot-toast** - Toast notifications
- **localStorage** - Data persistence (simulating backend)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
blogsphere/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── CreatePost.jsx
│   │   ├── BlogDetails.jsx
│   │   ├── MyPosts.jsx
│   │   └── EditPost.jsx
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

## Usage

1. **Sign Up**: Create a new account to start blogging
2. **Login**: Sign in to your account
3. **Create Post**: Click "Create Blog" to write a new post
4. **View Posts**: Browse all posts on the home page
5. **Interact**: Like and comment on posts
6. **Manage**: Edit or delete your own posts from "My Posts"

## Color Palette

- Primary: Teal (#14b8a6)
- Background: White & Gray-50
- Text: Dark Gray (#1f2937)
- Accents: Teal shades

## Fonts

- Primary: Inter
- Secondary: Poppins

## Notes

- All data is stored in localStorage (simulating a backend)
- Images are stored as base64 URLs (URL.createObjectURL)
- User sessions persist across page refreshes
- All features work entirely on the frontend

## License

This project is open source and available for personal use.

