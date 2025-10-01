import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEye, FaBrain, FaGamepad, FaChartLine, FaDatabase, FaSearch, FaInfoCircle, FaTimes, FaHeart } from 'react-icons/fa';

const Projects = () => {
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

  // Search / Filter state
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState({ open: false, project: null });
  const prefersReducedMotion = useReducedMotion();

  const AREA_ICON = { 
    'Full-Stack Development': '💻', 
    'Computer Vision': '🖼️', 
    'Machine Learning': '🤖', 
    'Data Science': '📊', 
    'Game Development': '🎮', 
    'Operations Research': '📈' 
  };

  const projects = useMemo(() => [
    {
      title: "Intelligence School Management System",
      description:
        "A full-featured school management system that handles student records, classes, grades, attendance, teachers, and fee management. Includes secure authentication, role-based access, and reporting tools to streamline administrative workflows for educational institutions.",
      image: "/api/placeholder/600/400",
      icon: FaDatabase,
      stack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "XAMPP"],
      github: "https://github.com/imahrous13/intelligence-school",
      demo: "https://intelligence-school-demo.com",
      category: "Full-Stack Development"
    },
    
      {
        title: "Tracking Barbell Exercises with ML",
        description:
          "Machine learning project focused on analyzing barbell exercise movements from video data. The system tracks barbell motion, counts repetitions, and extracts key metrics such as range of motion and path consistency to provide feedback on training performance.",
        image: "/api/placeholder/600/400",
        icon: FaBrain,
        stack: ["Python", "Machine Learning", "Data Analysis", "NumPy", "Jupyter"],
        github: "https://github.com/imahrous13/Tracking-barbell-exercises-with-ml",
        demo: "https://barbell-tracking-demo.com",
        category: "Machine Learning"
      },
      
    {
      title: "Tic-Tac-Toe AI with Genetic Algorithm",
      description: "Intelligent Tic-Tac-Toe game featuring AI training using Genetic Algorithm. The AI learns optimal strategies through evolutionary computation, demonstrating advanced machine learning concepts in game theory.",
      image: "/api/placeholder/600/400",
      icon: FaGamepad,
      stack: ["Python", "Genetic Algorithms", "AI", "Game Theory"],
      github: "https://github.com/imahrous13/tictactoe_AI",
      demo: "https://tictactoe-ai-demo.com",
      category: "Game Development"
    },
    {
      title: "Python Game Collection",
      description: "Collection of classic games including Tic-Tac-Toe, Blackjack, Connect-4, and QuizBrain. Features modern GUI design with Tkinter and intelligent gameplay mechanics for entertainment and learning.",
      image: "/api/placeholder/600/400",
      icon: FaGamepad,
      stack: ["Python", "Tkinter", "GUI", "Game Development"],
      github: "https://github.com/imahrous13/games",
      demo: "https://games-demo.com",
      category: "Game Development"
    },
    {
      title: "Multi-Stage Manufacturing Process",
      description: "Advanced optimization system for multi-stage continuous flow manufacturing processes. Implements operations research techniques to optimize production efficiency and resource allocation.",
      image: "/api/placeholder/600/400",
      icon: FaChartLine,
      stack: ["Python", "Operations Research", "Optimization", "Manufacturing"],
      github: "https://github.com/imahrous13/Multi-stage-continuous-flow-manufacturing-process",
      demo: "https://manufacturing-optimization-demo.com",
      category: "Operations Research"
    },
    {
      title: "E-Commerce Cart System",
      description: "Full-featured e-commerce cart system built with Java. Includes product management, shopping cart functionality, order processing, and user authentication with modern Java technologies.",
      image: "/api/placeholder/600/400",
      icon: FaDatabase,
      stack: ["Java", "E-Commerce", "Cart System", "Backend"],
      github: "https://github.com/imahrous13/Cart",
      demo: "https://cart-demo.com",
      category: "Full-Stack Development"
    },
    {
      title: "Heart Disease Analysis & Prediction",
      description: "Comprehensive data science project analyzing heart disease patterns using machine learning. Features exploratory data analysis, correlation matrices, preprocessing, and predictive modeling with logistic regression and other algorithms.",
      image: "/api/placeholder/600/400",
      icon: FaHeart,
      stack: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "Logistic Regression"],
      github: "https://github.com/imahrous13/Heart-Disease-analysis",
      demo: "https://heart-disease-analysis-demo.com",
      category: "Data Science"
    },
    {
    title: "Garbage Classification (TrashNet)",
    description:
      "Image classification and detection project using CNNs and YOLOv8 for automatic garbage sorting. Includes GAN-based data augmentation to improve accuracy on limited datasets.",
    image: "/api/placeholder/600/400",
    icon: FaEye,
    stack: ["Python", "PyTorch", "YOLOv8", "CNN", "GAN", "Albumentations"],
    github: "https://github.com/imahrous13/Garbage-Classification",
    demo: "https://garbage-classification-demo.com",
    category: "Computer Vision",
  },
  ], []);

  // Optional merge from projects.json
  const [mergedProjects, setMergedProjects] = useState(projects);
  
  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const res = await fetch('/projects.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const extras = Array.isArray(data?.projects) ? data.projects : [];
        // Merge: avoid duplicates by github url or title
        const seenRepo = new Set(projects.map(p=>p.github).filter(Boolean));
        const seenTitle = new Set(projects.map(p=>p.title.toLowerCase()));
        const uniqueExtras = extras.filter(p => {
          const t = (p.title||'').toLowerCase();
          return !(p.github && seenRepo.has(p.github)) && !(t && seenTitle.has(t));
        }).map(p => ({
          title: p.title,
          description: p.description || p.desc || '',
          image: p.image || '/api/placeholder/600/400',
          icon: FaDatabase,
          stack: p.stack || [],
          github: p.repo || p.github || '#',
          demo: p.demo || '#',
          category: p.category || 'Full-Stack Development',
          featured: !!p.featured,
        }));
        if (isActive) setMergedProjects([...projects, ...uniqueExtras]);
      } catch {
        // ignore
      }
    })();
    return () => { isActive = false; };
  }, [projects]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(mergedProjects.map(p=>p.category)))], [mergedProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mergedProjects.filter(p => {
      const inCat = filter === 'All' || p.category === filter;
      const hay = [p.title, p.description, ...(p.stack||[])].join(' ').toLowerCase();
      const inSearch = !q || hay.includes(q);
      return inCat && inSearch;
    });
  }, [mergedProjects, filter, query]);

  const totalCount = mergedProjects.length;
  const mlCount = mergedProjects.filter(p=>['Computer Vision','Machine Learning','Data Science'].includes(p.category)).length;
  const pyCount = mergedProjects.filter(p=>p.stack?.some(s=>/python|numpy|pytorch|tensorflow|opencv|pandas|scikit/i.test(s))).length;

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            My <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8"
          />
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            A showcase of my work spanning machine learning, web development, 
            and operations research
          </motion.p>
        </motion.div>

        {/* Controls */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search projects… (e.g., 'GAN', 'GUI', 'SQL', 'CV')"
              className="w-full bg-dark-800/50 border border-dark-700 rounded-lg pl-10 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={()=>setFilter(cat)}
                className={`px-3 py-2 rounded-full text-sm border ${filter===cat ? 'border-primary-500 text-white bg-primary-500/10' : 'border-dark-700 text-gray-300 bg-dark-800/50'} transition-colors`}
              >
                <span className="mr-1">{AREA_ICON[cat] || '🌐'}</span>{cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-3 max-w-5xl mx-auto mb-8">
          <div className="text-center p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{totalCount}</div>
            <div className="text-gray-400 text-sm">Total Projects</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{mlCount}</div>
            <div className="text-gray-400 text-sm">ML / CV / DS</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{pyCount}</div>
            <div className="text-gray-400 text-sm">Python / Apps</div>
          </div>
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -10 }}
              className="bg-dark-800/30 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-500/50 transition-all duration-300 card-hover"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                <project.icon className="text-primary-400 text-6xl" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded border border-dark-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    onClick={()=>setModal({ open: true, project })}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaInfoCircle />
                    <span>Details</span>
                  </motion.button>
                  <motion.a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaExternalLinkAlt />
                    <span>Demo</span>
                  </motion.a>
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaGithub />
                    <span>Code</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {modal.open && modal.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setModal({ open:false, project:null })} />
            <div className="relative bg-dark-900 border border-dark-700 rounded-xl max-w-2xl w-full p-6 z-10">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={()=>setModal({ open:false, project:null })} aria-label="Close">
                <FaTimes />
              </button>
              <h3 className="text-xl font-bold text-white mb-2">{modal.project.title}</h3>
              <p className="text-gray-300 mb-4">{modal.project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(modal.project.stack||[]).map((t,i)=>(
                  <span key={i} className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded border border-dark-600">{t}</span>
                ))}
              </div>
              <div className="flex gap-3">
                <a className="btn-primary inline-flex items-center" href={modal.project.github} target="_blank" rel="noopener noreferrer"><FaGithub className="mr-2" />Repository</a>
                <a className="btn-secondary inline-flex items-center" href={modal.project.demo} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt className="mr-2" />Live Demo</a>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-16"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in collaborating?
            </h3>
            <p className="text-gray-300 mb-8">
              I'm always open to discussing new projects and opportunities
            </p>
            <motion.a
              href="#contact"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
