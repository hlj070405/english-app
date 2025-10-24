import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './StudyPage.css'

function StudyPage({ onNavigate }) {
  const [currentWord, setCurrentWord] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [showDontKnow, setShowDontKnow] = useState(false)
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 👇 在组件函数内部，useState 声明之后添加
  useEffect(() => {
  const fetchWords = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/learn/session?limit=20', {
        credentials: 'include' // 携带Cookie用于认证
      })
      
      if (!response.ok) {
        throw new Error('获取单词失败，请检查网络或稍后再试')
      }
      
      const data = await response.json()
      setWords(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setWords([])
    } finally {
      setLoading(false)
    }
  }

  fetchWords()
  }, []) // 空依赖数组，只在组件挂载时执行一次

  // 键盘监听
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase()
      
      if (key === 'z' && !isFlipped) {
        // Z键 - 不认识，翻转卡片查看释义，但不跳转
        setIsFlipped(true)
        setShowDontKnow(true)
        submitResultOnly(false) // 只提交结果，不跳转
      } else if (key === 'x') {
        // X键 - 跳到下一张
        if (!isFlipped) {
          // 如果还没翻转，说明用户认识这个单词
          submitResultOnly(true) // 提交"认识"
        }
        // 无论是否翻转，都跳到下一张
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, currentWord, words])

  // 只提交结果，不跳转
  const submitResultOnly = async (isCorrect) => {
    try {
      await fetch('/api/learn/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          wordId: words[currentWord].id, 
          isCorrect 
        }),
      })
    } catch (error) {
      console.error('提交学习结果失败:', error)
    }
  }

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

  // 所有 Hooks 已经调用完毕，现在可以处理条件性 return
  if (loading) {
    return (
      <div className="study-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>正在加载单词...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="study-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.5rem', color: '#ff4444' }}>{error}</p>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="study-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.5rem', color: '#4CAF50' }}>🎉 今日任务已完成！</p>
      </div>
    )
  }

  const word = words[currentWord]

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
                  
                  <div className="card-hint">
                    <p>按 <kbd>Z</kbd> 不认识 · 按 <kbd>X</kbd> 认识</p>
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
                    {(() => {
                      try {
                        const phrases = JSON.parse(word.phrase || '[]')
                        if (phrases.length > 0) {
                          return (
                            <>
                              <p className="example-en">{phrases[0].phrase}</p>
                              <p className="example-cn">{phrases[0].translation}</p>
                            </>
                          )
                        }
                      } catch (e) {
                        console.error('解析phrase失败:', e)
                      }
                      return null
                    })()}
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
