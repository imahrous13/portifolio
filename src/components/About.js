import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCode, FaBrain, FaRocket } from 'react-icons/fa';

const About = () => {
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

  const highlights = [
    {
      icon: FaGraduationCap,
      title: "Data Scientist & ML/AI Specialist",
      description: "Expert in advanced analytics, machine learning, and deep learning with comprehensive knowledge of modern AI frameworks"
    },
    {
      icon: FaCode,
      title: "Full-Stack Developer",
      description: "Building end-to-end solutions with modern web technologies and frameworks"
    },
    {
      icon: FaBrain,
      title: "AI/ML Enthusiast",
      description: "Specializing in computer vision, deep learning, and optimization algorithms"
    },
    {
      icon: FaRocket,
      title: "Problem Solver",
      description: "Creating innovative solutions for real-world challenges using technology"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
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
            About <span className="gradient-text">Me</span>
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Passionate About Technology & Innovation
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I'm a passionate Data Scientist, Full-Stack Web Developer, and ML/AI Specialist 
                dedicated to transforming data into actionable insights and building intelligent 
                systems that solve real-world challenges. My expertise spans advanced analytics, 
                machine learning, deep learning, and modern web technologies.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I specialize in creating solutions that bridge the gap between data and 
                decision-making, using innovative tools and frameworks like Python, PyTorch, 
                TensorFlow, and modern web technologies. My projects demonstrate proficiency 
                in computer vision, genetic algorithms, operations research, and full-stack 
                development across multiple domains.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Constantly learning and experimenting with new technologies, I strive to stay 
                at the forefront of the ever-evolving tech landscape while sharing knowledge 
                through projects and collaborations. I enjoy building high-performance web 
                applications and developing intelligent systems that deliver measurable impact.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-6 bg-dark-800/50 rounded-lg border border-dark-700">
                <div className="text-3xl font-bold gradient-text mb-2">10+</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center p-6 bg-dark-800/50 rounded-lg border border-dark-700">
                <div className="text-3xl font-bold gradient-text mb-2">5+</div>
                <div className="text-gray-400">Technologies Mastered</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Highlights */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="p-6 bg-dark-800/30 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <highlight.icon className="text-white text-xl" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {highlight.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
