import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaRandom } from 'react-icons/fa';

const TL_KEY = 'im_tagline_idx';
const ST_KEY = 'im_subtitle_idx';

const TAGLINES = [
  'I craft practical AI demos, data-driven applications, and intuitive user interfaces.',
  'I turn data and AI into real-world solutions, from smart applications to clean, user-friendly designs.',
  'I’m passionate about building AI prototypes, data apps, and modern interfaces that bring ideas to life.',
  'I blend machine learning, data science, and web development to create practical AI demos and engaging user experiences.'
];

const SUBTITLES = [
  'Skilled in ML, CV, and modern web development, I design solutions that merge data science with intuitive design.',
  'From deep learning models and data pipelines to interactive dashboards and GUIs, I build tools that make AI practical.',
  'With experience across TensorFlow, PyTorch, Pandas, scikit-learn, and OpenCV, I bridge data, algorithms, and UX.',
  'I love transforming ideas into working prototypes — GANs, data utilities, and full-stack apps focused on clarity.'
];

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/imahrous13', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/ibrahim-mahrous-b0595594', label: 'LinkedIn' },
    { icon: FaEnvelope, href: 'mailto:ibrahim.mahrous@example.com', label: 'Email' },
  ];

  useEffect(() => {
    // No-op: state derived at render time via helpers; this ensures SSR-safety
  }, []);

  const getSavedIndex = (key, max) => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    const idx = raw != null ? parseInt(raw, 10) : NaN;
    return Number.isFinite(idx) && idx >= 0 && idx < max ? idx : 0;
  };

  const taglineIndex = getSavedIndex(TL_KEY, TAGLINES.length);
  const subtitleIndex = getSavedIndex(ST_KEY, SUBTITLES.length);

  const shuffleTagline = () => {
    const nextTL = Math.floor(Math.random() * TAGLINES.length);
    const nextST = Math.floor(Math.random() * SUBTITLES.length);
    window.localStorage.setItem(TL_KEY, String(nextTL));
    window.localStorage.setItem(ST_KEY, String(nextST));
    // Force update by navigating hash (cheap) then reverting, or trigger state via location replace
    // Simpler: reload only Hero via full refresh of the page area; here we use location.reload for reliability
    window.location.hash = '#home';
    window.location.reload();
  };

  const downloadResumePdf = () => {
    const a = document.createElement('a');
    a.href = '/IBRAHIM-MOHAMED-MAHROUS.pdf';
    a.download = 'IBRAHIM-MOHAMED-MAHROUS.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="text-primary-400 text-lg font-medium">Hello, I'm</span>
          </motion.div>

          {/* Name */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Ibrahim Mohamed{' '}
            <span className="gradient-text">Mahrous</span>
          </motion.h1>

          {/* Role */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium">
              Computer & Data Science Student
            </h2>
            <p className="text-lg sm:text-xl text-primary-400 mt-2">
              {TAGLINES[taglineIndex]}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {SUBTITLES[subtitleIndex]}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              View My Projects
            </motion.a>
            <motion.button
              onClick={downloadResumePdf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center"
              type="button"
            >
              <FaDownload className="mr-2" />
              Download Resume (PDF)
            </motion.button>
            <motion.button
              onClick={shuffleTagline}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center"
              type="button"
            >
              <FaRandom className="mr-2" /> Shuffle Tagline
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center space-x-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>

          {/* Location */}
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <p className="text-gray-500 text-sm">
              📍 Alexandria, Egypt
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-4 h-4 bg-primary-500 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-10 w-6 h-6 bg-primary-400 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-primary-600 rounded-full opacity-20"
        />
      </div>
    </section>
  );
};

export default Hero;
