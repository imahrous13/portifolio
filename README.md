# Ibrahim Mohamed Mahrous - Portfolio Website

A modern, responsive portfolio website built with React, Tailwind CSS, and Framer Motion. Showcasing projects in Machine Learning, Computer Vision, Full-Stack Development, and Operations Research.

## 🚀 Features

- **Modern Design**: Clean, dark theme with gradient accents and smooth animations
- **Responsive Layout**: Optimized for all device sizes (mobile, tablet, desktop)
- **Interactive Animations**: Smooth transitions and hover effects using Framer Motion
- **Project Showcase**: Detailed project cards with GitHub and demo links
- **GitHub Integration**: Automatically fetches and displays projects from your GitHub repositories
- **Skills Visualization**: Animated progress bars and skill categories
- **Contact Form**: Functional contact form with validation
- **SEO Optimized**: Meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites

Make sure you have Node.js (version 14 or higher) and npm installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/imahrous13/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Create a `.env` file in the root directory to configure GitHub integration:

```bash
# GitHub Configuration
GITHUB_USERNAME=your_github_username

# Optional: GitHub Personal Access Token for higher rate limits
# Create one at: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_token_here
```

**Note**: If you don't set `GITHUB_USERNAME`, it defaults to `imahrous13`. The GitHub token is optional but recommended for production to avoid rate limiting (increases limit from 60 to 5000 requests/hour).

### 4. Start Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

**Note**: Make sure to also start the backend server for GitHub integration to work:

```bash
# In a separate terminal
npm run server
```

The backend server runs on `http://localhost:3001` by default.

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── Hero.js            # Hero section with introduction
│   ├── About.js           # About section
│   ├── Skills.js          # Skills showcase
│   ├── Projects.js        # Projects portfolio
│   ├── Contact.js         # Contact form and info
│   └── Footer.js          # Footer component
├── App.js                 # Main application component
├── index.js               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## 🎨 Customization

### Colors and Theme

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary color palette
  },
  dark: {
    // Your dark theme colors
  }
}
```

### Content Updates

1. **Personal Information**: Update the content in each component file
2. **Projects**: 
   - Projects are automatically fetched from your GitHub repositories
   - You can still add manual projects via `public/projects.json`
   - Hardcoded projects in `src/components/Projects.js` are always shown first
3. **Skills**: Update the `skillCategories` array in `src/components/Skills.js`
4. **Contact Info**: Change contact details in `src/components/Contact.js` and `src/components/Footer.js`

### GitHub Integration

The portfolio automatically fetches your GitHub repositories and displays them as projects. The system:

- Fetches all non-archived repositories from your GitHub account
- Automatically categorizes projects based on repository name, description, topics, and language
- Merges GitHub projects with manually added projects (from `projects.json` and hardcoded projects)
- Updates automatically when you push new repositories to GitHub
- Caches results for 1 hour to reduce API calls

**Project Categories**: Projects are automatically categorized into:
- Full-Stack Development
- Computer Vision
- Machine Learning
- Data Science
- Game Development
- Operations Research

### Images

Replace placeholder images with your actual project screenshots:
- Add images to the `public` folder
- Update image paths in the projects array

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations

The website uses Framer Motion for smooth animations:
- Page load animations
- Scroll-triggered animations
- Hover effects
- Button interactions
- Floating elements

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Contact

**Ibrahim Mohamed Mahrous**
- Email: imahrous13@gmail.com
- GitHub: [@imahrous13](https://github.com/imahrous13)
- LinkedIn: [Ibrahim Mohamed Mahrous](https://linkedin.com/in/ibrahim-mahrous-b0595594)
- Location: Alexandria, Egypt

---

⭐ If you found this project helpful, please give it a star!
