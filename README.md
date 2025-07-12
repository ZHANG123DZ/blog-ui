# BlogUI - Modern React Blog UI

A modern, responsive blog UI built with React, featuring a clean design, component-based architecture, and comprehensive user flows.

![BlogUI Preview](https://via.placeholder.com/1200x630?text=BlogUI+Preview)

## Features

- 📱 **Fully Responsive Design**: Optimized for all device sizes
- 🎨 **Modern UI/UX**: Clean, accessible interface with attention to detail
- 🧩 **Component-Based Architecture**: Modular, reusable components
- �� **Multiple Page Types**: Home, Topic, Blog Detail, Authentication pages
- 🔒 **Authentication Flows**: Login, Register, Forgot Password, Reset Password
- 🔍 **Error Handling**: 404 page, Error Boundary for graceful error handling
- 🚀 **Performance Optimized**: Fast loading times and smooth transitions

## Pages

- **Home (/)**: Featured posts, topic list, and recent posts
- **Topic (/topics)**: Topic-specific post listings with pagination
- **Blog Detail (/blog/:slug)**: Full blog post with author info, comments, and related posts
- **Authentication**:
  - Login (/login)
  - Register (/register)
  - Forgot Password (/forgot-password)
  - Reset Password (/reset-password)
- **Error Pages**: Custom 404 page and error boundary fallback

## Tech Stack

- **React**: UI library
- **React Router**: For routing and navigation
- **SCSS Modules**: For component-scoped styling
- **Vite**: Build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-ui.git
   cd blog-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
blog-ui/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images and other assets
│   ├── components/    # Reusable components
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   ├── styles/        # Global styles and variables
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── index.html         # HTML template
└── vite.config.js     # Vite configuration
```

## Component Architecture

The project follows a modular component architecture:

- **UI Components**: Button, Input, Card, Badge, etc.
- **Layout Components**: Header, Footer, Navigation, etc.
- **Page Components**: Home, Topic, BlogDetail, etc.
- **Feature Components**: CommentSection, AuthorInfo, etc.

## Styling

The project uses SCSS modules for component-scoped styling with:

- Global variables for colors, spacing, typography
- Mixins for responsive design and common patterns
- Component-specific styles in `.module.scss` files

## Deployment

Build the project for production:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` directory, which can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspiration from various modern blog platforms
- Icons from [Heroicons](https://heroicons.com/)
- Placeholder images from [Placeholder.com](https://placeholder.com/)
# blog-ui
# blog-ui
# blog-ui
