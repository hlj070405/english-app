import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import ArticleStudyPage from './pages/ArticleStudyPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'study', 'article'

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }

  const pageTransition = {
    duration: 0.4,
    ease: 'easeInOut'
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <HomePage 
              onNavigate={() => setCurrentPage('study')}
              onNavigateArticle={() => setCurrentPage('article')}
            />
          </motion.div>
        )}
        {currentPage === 'study' && (
          <motion.div
            key="study"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <StudyPage onNavigate={() => setCurrentPage('home')} />
          </motion.div>
        )}
        {currentPage === 'article' && (
          <motion.div
            key="article"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ArticleStudyPage onNavigate={() => setCurrentPage('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
