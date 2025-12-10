import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEye, FaBrain, FaGamepad, FaChartLine, FaDatabase, FaSearch, FaInfoCircle, FaTimes } from 'react-icons/fa';

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
    'Web Development': '🌐',
    'Computer Vision': '🖼️', 
    'Machine Learning': '🤖', 
    'Data Science': '📊', 
    'Game Development': '🎮', 
    'NLP': '💬'
  };

  // Fallback projects (used if projects.json fails to load)
  const projects = useMemo(() => [], []);

  // Load projects from projects.json
  const [mergedProjects, setMergedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isActive = true;
    
    (async () => {
      try {
        setLoading(true);
        
        // Fetch from projects.json
        const jsonRes = await fetch('/projects.json', { cache: 'no-store' });
        let jsonProjects = [];
        
        if (jsonRes.ok) {
          const jsonData = await jsonRes.json();
          jsonProjects = Array.isArray(jsonData?.projects) ? jsonData.projects : [];
        }
        
        // Icon mapping for categories
        const iconMap = {
          'Computer Vision': FaEye,
          'Machine Learning': FaBrain,
          'Data Science': FaChartLine,
          'Game Development': FaGamepad,
          'NLP': FaBrain,
          'Web Development': FaDatabase
        };
        
        // Process projects from JSON
        const processedProjects = jsonProjects.map(p => {
          if (!p || !p.title) return null;
          const category = p.category || 'Web Development';
          return {
            title: p.title,
            description: p.description || '',
            image: p.image || '/api/placeholder/600/400',
            icon: iconMap[category] || FaDatabase,
            stack: Array.isArray(p.stack) ? p.stack : [],
            github: p.github || '#',
            demo: p.demo || '#',
            category: category,
            featured: !!p.featured,
            readme_summary: p.readme_summary || null
          };
        }).filter(p => p !== null);
        
        if (isActive) {
          setMergedProjects(processedProjects.length > 0 ? processedProjects : projects);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        if (isActive) {
          setMergedProjects(projects);
          setLoading(false);
        }
      }
    })();
    
    return () => { 
      isActive = false;
    };
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
  const mlCount = mergedProjects.filter(p=>['Computer Vision','Machine Learning','Data Science','NLP'].includes(p.category)).length;
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
            A showcase of my work spanning AI, machine learning, computer vision, data science, and web development
          </motion.p>
        </motion.div>

        {/* Controls */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search projects… (e.g., 'Python', 'ML', 'NLP')"
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
            <div className="text-gray-400 text-sm">AI / ML / CV / DS</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{pyCount}</div>
            <div className="text-gray-400 text-sm">Python Projects</div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        )}

        {/* Project Grid */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found matching your search.</p>
          </div>
        )}
        
        {!loading && filtered.length > 0 && (
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
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.slice(0, 4).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded border border-dark-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="px-2 py-1 bg-dark-700/50 text-gray-400 text-xs rounded border border-dark-600">
                      +{project.stack.length - 4} more
                    </span>
                  )}
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
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaGithub />
                    <span>Code</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Modal */}
        {modal.open && modal.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setModal({ open:false, project:null })} />
            <div className="relative bg-dark-900 border border-dark-700 rounded-xl max-w-2xl w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={()=>setModal({ open:false, project:null })} aria-label="Close">
                <FaTimes />
              </button>
              <h3 className="text-xl font-bold text-white mb-2">{modal.project.title}</h3>
              <p className="text-gray-300 mb-4">{modal.project.description}</p>
              
              {modal.project.readme_summary && (
                <div className="mb-6 space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {modal.project.readme_summary.features && (
                    <div>
                      <h4 className="text-sm font-semibold text-primary-400 mb-2">Key Features</h4>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                        {modal.project.readme_summary.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {modal.project.readme_summary.installation && (
                    <div>
                      <h4 className="text-sm font-semibold text-primary-400 mb-2">Installation</h4>
                      <code className="block bg-dark-800 p-2 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap">
                        {modal.project.readme_summary.installation}
                      </code>
                    </div>
                  )}

                  {modal.project.readme_summary.usage && (
                    <div>
                      <h4 className="text-sm font-semibold text-primary-400 mb-2">Usage</h4>
                      <code className="block bg-dark-800 p-2 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap">
                        {modal.project.readme_summary.usage}
                      </code>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {(modal.project.stack||[]).map((t,i)=>(
                  <span key={i} className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded border border-dark-600">{t}</span>
                ))}
              </div>
              <div className="flex gap-3">
                <a className="btn-primary inline-flex items-center" href={modal.project.github} target="_blank" rel="noopener noreferrer"><FaGithub className="mr-2" />Repository</a>
                {modal.project.demo && modal.project.demo !== '#' && (
                  <a className="btn-secondary inline-flex items-center" href={modal.project.demo} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt className="mr-2" />Live Demo</a>
                )}
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
