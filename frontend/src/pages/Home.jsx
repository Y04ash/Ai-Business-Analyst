// pages/HomePage.jsx
import React from 'react';
import '../css/home.css';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Explore Your Data',
    desc: ['Visualize trends, patterns, and key business metrics.', 'Interactive charts for deep insights.'],
    icon: '📊',
  },
  {
    title: 'Discover Product Relationships',
    desc: ['Understand product bundles and co-purchase behaviors.', 'Drive smarter inventory and marketing decisions.'],
    icon: '🔗',
  },
  {
    title: 'Customer Intelligence',
    desc: ['Segment customers based on buying behavior.', 'Target campaigns to specific customer groups.'],
    icon: '👥',
  },
  {
    title: 'Value-Based Analysis',
    desc: ['Identify loyal and high-value customers.', 'Prioritize your most profitable segments.'],
    icon: '💰',
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Welcome to InsightLoop</h1>
        <p>Your intelligent dashboard for actionable business insights. Upload, analyze, and grow.</p>
      </motion.header>

      <motion.section
        className="features-section"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <ul>
              {feature.desc.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.section>

     
    </div>
  );
};

export default Home;
