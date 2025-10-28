import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import ArticleStudyPage from './pages/ArticleStudyPage'
import AuthPage from './pages/AuthPage'
import AIChatPage from './pages/AIChatPage'
import MyVocabularyPage from './pages/MyVocabularyPage'
import ExamPracticePage from './pages/ExamPracticePage'
import './App.css'

function App() {
  const [user, setUser] = useState(null) // 用户状态
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'study', 'article', 'ai-chat', 'vocabulary', 'exam'
  const [aiInitialQuestion, setAiInitialQuestion] = useState('')
  const [selectedArticleMode, setSelectedArticleMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('articleMode') || 'generic'
    }
    return 'generic'
  })

  // 检查localStorage以实现持久化登录，并验证 Session 是否有效
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // 验证 Session 是否还有效
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Session 已失效，清除本地数据
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Session validation failed", error);
        localStorage.removeItem('user');
        setUser(null);
      }
    };
    
    checkSession();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }

  const pageTransition = {
    duration: 0.4,
    ease: 'easeInOut'
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('articleMode', selectedArticleMode)
    }
  }, [selectedArticleMode])

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
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
              user={user}
              onLogout={handleLogout}
              onNavigate={(page, data) => {
                switch (page) {
                  case 'ai-chat':
                    setAiInitialQuestion(data || '')
                    setCurrentPage('ai-chat')
                    break
                  case 'vocabulary':
                    setCurrentPage('vocabulary')
                    break
                  case 'exam':
                    setCurrentPage('exam')
                    break
                  case 'study':
                  default:
                    setCurrentPage('study')
                    break
                }
              }}
              articleMode={selectedArticleMode}
              onArticleModeChange={(mode) => setSelectedArticleMode(mode)}
              onNavigateArticle={(mode) => {
                setSelectedArticleMode(mode)
                setCurrentPage('article')
              }}
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
            <ArticleStudyPage 
              onNavigate={() => setCurrentPage('home')} 
              initialMode={selectedArticleMode}
            />
          </motion.div>
        )}
        {currentPage === 'ai-chat' && (
          <motion.div
            key="ai-chat"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AIChatPage 
              initialQuestion={aiInitialQuestion}
              onBack={() => setCurrentPage('home')}
            />
          </motion.div>
        )}
        {currentPage === 'vocabulary' && (
          <motion.div
            key="vocabulary"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <MyVocabularyPage 
              onBack={() => setCurrentPage('home')}
            />
          </motion.div>
        )}
        {currentPage === 'exam' && (
          <motion.div
            key="exam"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ExamPracticePage 
              onBack={() => setCurrentPage('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
