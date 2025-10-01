import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaPython, 
  FaPhp, 
  FaReact, 
  FaGitAlt, 
  FaDatabase,
  FaBrain,
  FaEye,
  FaChartLine,
  FaGamepad,
  FaCogs,
  FaCode,
} from 'react-icons/fa';
import { SiMysql, SiOpencv, SiTensorflow } from 'react-icons/si';

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: FaCode,
      skills: [
        { name: "Python", icon: FaPython, level: 90 },
        { name: "PHP", icon: FaPhp, level: 85 },
        { name: "JavaScript", icon: FaReact, level: 80 },
        { name: "SQL", icon: FaDatabase, level: 85 }
      ]
    },
    {
      title: "Machine Learning & AI",
      icon: FaBrain,
      skills: [
        { name: "Computer Vision", icon: FaEye, level: 88 },
        { name: "Deep Learning", icon: FaBrain, level: 85 },
        { name: "OpenCV", icon: SiOpencv, level: 82 },
        { name: "TensorFlow", icon: SiTensorflow, level: 80 }
      ]
    },
    {
      title: "Web Development",
      icon: FaReact,
      skills: [
        { name: "React", icon: FaReact, level: 85 },
        { name: "MySQL", icon: SiMysql, level: 88 },
        { name: "Git/GitHub", icon: FaGitAlt, level: 90 },
        { name: "Tkinter", icon: FaGamepad, level: 85 }
      ]
    },
    {
      title: "Operations Research",
      icon: FaChartLine,
      skills: [
        { name: "Simplex Method", icon: FaCogs, level: 90 },
        { name: "Big-M Method", icon: FaCogs, level: 88 },
        { name: "Two-Phase Method", icon: FaCogs, level: 85 },
        { name: "Graphical LP", icon: FaChartLine, level: 87 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/20">
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
            My <span className="gradient-text">Skills</span>
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8"
          />
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            A comprehensive toolkit spanning machine learning, web development, 
            and operations research
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-dark-800/30 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4">
                  <category.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: skillIndex * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <skill.icon className="text-primary-400 text-lg" />
                        <span className="text-gray-300 font-medium">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-primary-400 text-sm font-medium">
                        {skill.level}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: skillIndex * 0.1 }}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-bold text-white text-center mb-8"
          >
            Additional <span className="gradient-text">Expertise</span>
          </motion.h3>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              "YOLO Object Detection",
              "CNN & GAN Networks", 
              "Active Contours",
              "Genetic Algorithms",
              "Linear Programming",
              "Data Augmentation",
              "GUI Development",
              "Database Design",
              "API Development",
              "Version Control"
            ].map((skill, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-4 py-2 bg-dark-800/50 border border-dark-600 rounded-full text-gray-300 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-300 cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
