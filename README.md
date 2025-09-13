Email Sender (Gmail SMTP)

This is a tiny, reusable Python script to send emails via SMTP (tested with Gmail). It defaults to sending to `imahrous13@gmail.com` but you can override the recipient.

Prerequisites
- Python 3.8+
- A Gmail account with 2‑Step Verification enabled
- A Gmail App Password (16 characters) for SMTP

Get a Gmail App Password
1. Turn on 2‑Step Verification in your Google Account.
2. Create an App Password for "Mail" on your device.
   - Official guides: [Turn on 2‑Step Verification](https://support.google.com/accounts/answer/185839) and [Sign in with app passwords](https://support.google.com/accounts/answer/185833).

Setup
1. Copy `.env.example` to `.env` and fill in your details:
   - `EMAIL_USER`: your Gmail address
   - `EMAIL_PASS`: your Gmail App Password
   - Optionally adjust `DEFAULT_TO` and `EMAIL_FROM`
2. (Optional) Install `python-dotenv` to auto-load `.env` files:
   ```bash
   pip install -r requirements.txt
   ```

Usage
- Quick send (plain text):
  ```bash
  python3 send_email.py --subject "Hello" --text "This is a test"
  ```
- Send HTML:
  ```bash
  python3 send_email.py --subject "Hello" --html "<h1>Hi</h1><p>Test</p>"
  ```
- Override recipient(s):
  ```bash
  python3 send_email.py --to someone@example.com other@example.com --subject "Update" --text "FYI"
  ```
- Override SMTP settings (if not using Gmail):
  ```bash
  python3 send_email.py \
    --smtp-host smtp.example.com \
    --smtp-port 587 \
    --tls \
    --username user@example.com \
    --password "your_password" \
    --from "Your Name <user@example.com>" \
    --to recipient@example.com \
    --subject "Hello" \
    --text "Hello from a different SMTP server"
  ```

Environment variables
- `EMAIL_USER`, `EMAIL_PASS` (required): SMTP credentials (Gmail App Password recommended)
- `EMAIL_FROM` (optional): From header. Defaults to `EMAIL_USER`
- `DEFAULT_TO` (optional): Default recipient. Defaults to `imahrous13@gmail.com`
- `SMTP_HOST` (default `smtp.gmail.com`)
- `SMTP_PORT` (default `465`)
- `SMTP_USE_SSL` (default `true`)
- `SMTP_USE_TLS` (default `false`)

Note
- Do not use your normal Gmail password. Use an App Password.
- Do not commit your `.env` with secrets.

# Ibrahim Mohamed Mahrous - Portfolio Website

A modern, responsive portfolio website built with React, Tailwind CSS, and Framer Motion. Showcasing projects in Machine Learning, Computer Vision, Full-Stack Development, and Operations Research.

## 🚀 Features

- **Modern Design**: Clean, dark theme with gradient accents and smooth animations
- **Responsive Layout**: Optimized for all device sizes (mobile, tablet, desktop)
- **Interactive Animations**: Smooth transitions and hover effects using Framer Motion
- **Project Showcase**: Detailed project cards with GitHub and demo links
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

### 3. Start Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Build for Production

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
2. **Projects**: Modify the `projects` array in `src/components/Projects.js`
3. **Skills**: Update the `skillCategories` array in `src/components/Skills.js`
4. **Contact Info**: Change contact details in `src/components/Contact.js` and `src/components/Footer.js`

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
- Email: ibrahim.mahrous@example.com
- GitHub: [@imahrous13](https://github.com/imahrous13)
- LinkedIn: [Ibrahim Mohamed Mahrous](https://linkedin.com/in/ibrahim-mahrous-b0595594)
- Location: Alexandria, Egypt

---

⭐ If you found this project helpful, please give it a star!
