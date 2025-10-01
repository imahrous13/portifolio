import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaGithub,
      href: 'https://github.com/imahrous13',
      label: 'GitHub',
      color: 'hover:text-gray-300'
    },
    {
      icon: FaLinkedin,
      href: 'https://linkedin.com/in/ibrahim-mahrous-b0595594',
      label: 'LinkedIn',
      color: 'hover:text-blue-400'
    },
    {
      icon: FaEnvelope,
      href: 'mailto:imahrous13@gmail.com',
      label: 'Email',
      color: 'hover:text-primary-400'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Ibrahim Mohamed Mahrous
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Computer & Data Science student passionate about building intelligent 
              systems that solve real-world problems through AI, ML, and full-stack development.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-dark-800 border border-dark-600 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:border-primary-500/50`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <p className="text-gray-400">
                📧 imahrous13@gmail.com
              </p>
              <p className="text-gray-400">
                📍 Alexandria, Egypt
              </p>
              <p className="text-gray-400">
                🎓 Alexandria University
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-dark-700 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Ibrahim Mohamed Mahrous. All rights reserved.
            </p>
            <motion.p 
              className="text-gray-400 text-sm flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              Made with <FaHeart className="text-red-500 mx-1" /> using React & Tailwind
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
