import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './StudyPage.css'

function StudyPage({ onNavigate }) {
  const [currentWord, setCurrentWord] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [showDontKnow, setShowDontKnow] = useState(false)

  const words = [
    {
      word: 'Persistence',
      phonetic: '/pərˈsɪstəns/',
      meaning: 'n. 坚持；毅力',
      example: 'Success requires persistence.',
      translation: '成功需要坚持。',
      tip: 'persist(坚持) + ence(名词后缀)'
    },
    {
      word: 'Achievement',
      phonetic: '/əˈtʃiːvmənt/',
      meaning: 'n. 成就；完成',
      example: 'This is a great achievement.',
      translation: '这是一个伟大的成就。',
      tip: 'achieve(达到) + ment(名词后缀)'
    },
    {
      word: 'Dedication',
      phonetic: '/ˌdedɪˈkeɪʃn/',
      meaning: 'n. 奉献；专注',
      example: 'Her dedication is inspiring.',
      translation: '她的奉献精神很鼓舞人心。',
      tip: 'dedicate(致力于) + ion(名词后缀)'
    }
  ]

  const word = words[currentWord]

  // 键盘监听
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase()
      
      if (key === 'z' && !isFlipped) {
        // Z键 - 不会，翻转卡片并标记
        setIsFlipped(true)
        setShowDontKnow(true)
      } else if (key === 'x') {
        // X键 - 会了，滑出卡片
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, currentWord])

  // 下一张卡片
  const handleNext = () => {
    if (currentWord < words.length - 1) {
      setIsExiting(true)
      // 立即切换，不等待动画完成
      setTimeout(() => {
        setCurrentWord(currentWord + 1)
        setIsFlipped(false)
        setShowDontKnow(false)
        setIsExiting(false)
      }, 50) // 极短延迟，确保状态更新
    } else {
      // 完成所有单词
      alert('🎉 太棒了！今天的单词学完了！')
      onNavigate()
    }
  }

  return (
    <div className="study-page">
      {/* 顶部导航 */}
      <div className="study-header">
        <button className="back-btn" onClick={onNavigate}>
          ←
        </button>
        <div className="progress-text">
          {currentWord + 1} / {words.length}
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="study-content">
        
        {/* 单词卡片 */}
        <AnimatePresence>
          <motion.div 
            className={`word-card-container ${isFlipped ? 'flipped' : ''} ${isExiting ? 'exiting' : ''}`}
            key={currentWord}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              x: isExiting ? 1200 : 0,
              rotate: isExiting ? 25 : 0
            }}
            exit={{ 
              x: 1200,
              rotate: 25,
              opacity: 0,
              transition: { duration: 0.4 }
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{ zIndex: isExiting ? 10 : 1 }}
          >
            {/* 不会标记 */}
            {showDontKnow && (
              <div className="dont-know-badge"></div>
            )}

            <div className="word-card">
              {!isFlipped ? (
                // 正面 - 只显示单词
                <>
                  <h1 className="word-main">{word.word}</h1>
                  <p className="word-phonetic">{word.phonetic}</p>
                  <button className="sound-btn">🔊</button>
                  
                  <div className="card-hint">
                    <p>按 <kbd>Z</kbd> 查看释义 · 按 <kbd>X</kbd> 跳过</p>
                  </div>
                </>
              ) : (
                // 背面 - 显示详细信息
                <>
                  <div className="word-header">
                    <h2 className="word-title">{word.word}</h2>
                    <button className="sound-btn-small">🔊</button>
                  </div>
                  <p className="word-phonetic-small">{word.phonetic}</p>
                  
                  <div className="word-meaning">
                    {word.meaning}
                  </div>
                  
                  <div className="word-example">
                    <p className="example-en">{word.example}</p>
                    <p className="example-cn">{word.translation}</p>
                  </div>
                  
                  <div className="word-tip">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">{word.tip}</span>
                  </div>

                  <div className="card-hint" style={{ marginTop: '20px' }}>
                    <p>按 <kbd>X</kbd> 继续下一个</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}

export default StudyPage
