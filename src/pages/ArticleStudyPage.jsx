import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ArticleStudyPage.css'

function ArticleStudyPage({ onNavigate, initialMode = 'generic' }) {
  const [article, setArticle] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('') // 用户输入
  const [answeredQuestions, setAnsweredQuestions] = useState({})
  const [wordBank, setWordBank] = useState([])
  const [isShaking, setIsShaking] = useState(false) // 抖动状态
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [articleMode, setArticleMode] = useState(initialMode) // generic 或 custom
  const [articleId, setArticleId] = useState(null) // 当前文章ID（定制模式用）
  const [showMeaning, setShowMeaning] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showMeaning')
      return saved !== null ? saved === 'true' : true // 默认显示
    }
    return true
  })

  // 从后端获取文章
  const fetchArticle = async (mode) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/article/next?type=${mode}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.code === 'ARTICLES_NOT_UNLOCKED') {
          setError('NOT_UNLOCKED')
        } else if (errorData.code === 'NO_WORDS_AVAILABLE') {
          setError('NO_WORDS')
        } else if (errorData.code === 'NO_GENERIC_ARTICLES') {
          setError('NO_GENERIC')
        } else {
          setError('GENERATION_FAILED')
        }
        return
      }

      const data = await response.json()
      setArticle(data)
      setArticleId(data.articleId) // 保存文章ID（定制模式有值）
      
      // 解析文章生成题目
      const parsed = parseArticle(data.content, data.wordBank)
      setQuestions(parsed)
      
      // 初始化单词库（保留后端返回的 state）
      const initialWordBank = data.wordBank.map(w => ({
        word: w.word,
        meaning: w.meaning,
        status: w.state || 'unused', // 使用后端的 state，默认 unused
        hasBeenWrong: w.state === 'wrong' // 如果后端标记为 wrong，显示棕色小点
      }))
      setWordBank(initialWordBank)
      
      // 根据后端状态恢复答题进度
      const answeredMap = {}
      let firstUnanswered = -1 // 初始化为 -1 表示还没找到
      
      parsed.forEach((q, index) => {
        const wordItem = data.wordBank.find(w => w.word.toLowerCase() === q.word.toLowerCase())
        if (wordItem && wordItem.state && wordItem.state !== 'unused') {
          answeredMap[index] = wordItem.state // 'correct' or 'wrong'
        } else if (firstUnanswered === -1) {
          // 找到第一个未答的题目
          firstUnanswered = index
        }
      })
      
      // 如果所有题目都答过了，从头开始（或者可以设为最后一题）
      if (firstUnanswered === -1) {
        firstUnanswered = 0
      }
      
      setAnsweredQuestions(answeredMap)
      setCurrentQuestionIndex(firstUnanswered)
      setUserInput('')
      
      setError(null)
    } catch (err) {
      console.error('获取文章失败:', err)
      setError('NETWORK_ERROR')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载文章
  useEffect(() => {
    fetchArticle(articleMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('articleMode', articleMode)
    }
  }, [])

  // 当初始模式变化时，同步状态并重新拉取文章
  useEffect(() => {
    if (initialMode && initialMode !== articleMode) {
      setArticleMode(initialMode)
      fetchArticle(initialMode)
      if (typeof window !== 'undefined') {
        localStorage.setItem('articleMode', initialMode)
      }
    }
  }, [initialMode])

  // 持久化 showMeaning 状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showMeaning', showMeaning.toString())
    }
  }, [showMeaning])

  // 键盘监听
  useEffect(() => {
    const handleKeyPress = (e) => {
      // 已答题则跳过
      if (answeredQuestions[currentQuestionIndex]) return

      const key = e.key
      
      if (key === 'Backspace') {
        // 删除字符
        setUserInput(prev => prev.slice(0, -1))
      } else if (key === 'Enter') {
        // 提交答案
        if (userInput.trim()) {
          handleSubmitAnswer()
        }
      } else if (/^[a-zA-Z]$/.test(key)) {
        // 输入字母
        setUserInput(prev => prev + key)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestionIndex, userInput, answeredQuestions])

  // 完成文章并加载下一篇
  const handleArticleComplete = async () => {
    if (articleMode === 'custom' && articleId) {
      try {
        await fetch('/api/article/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ articleId })
        })
      } catch (err) {
        console.error('完成文章失败:', err)
      }
    }
    
    // 加载下一篇
    await fetchArticle(articleMode)
  }

  // 提交答案
  const handleSubmitAnswer = () => {
    const question = questions[currentQuestionIndex]
    const inputWord = userInput.toLowerCase().trim()
    const correctWord = question.correctAnswer.toLowerCase()

    // 检查输入的词是否在单词库中
    const wordInBank = wordBank.find(w => w.word.toLowerCase() === inputWord)
    
    if (!wordInBank) {
      // 不在词库中：抖动并清空
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setUserInput('')
      }, 500)
      return
    }

    const isCorrect = inputWord === correctWord.toLowerCase()

    if (isCorrect) {
      // 答对：更新单词库状态为correct
      setWordBank(prev => prev.map(w => 
        w.word.toLowerCase() === inputWord 
          ? { ...w, status: 'correct' }
          : w
      ))

      // 更新答题记录
      setAnsweredQuestions(prev => ({
        ...prev,
        [currentQuestionIndex]: 'correct'
      }))

      // 同步到后端（定制模式）
      if (articleMode === 'custom' && articleId) {
        updateWordProgressToBackend(inputWord, 'correct')
      }

      // 清空输入
      setUserInput('')

      // 快速跳到下一题
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }, 100) // 100ms延迟，体验更好
      } else {
        // 所有题目完成，加载下一篇文章
        setTimeout(() => {
          handleArticleComplete()
        }, 500)
      }
    } else {
      // 答错：标记两个单词（输入的错误词 + 正确答案词）
      setWordBank(prev => prev.map(w => {
        const wLower = w.word.toLowerCase()
        if (wLower === inputWord) {
          return { ...w, status: 'wrong', hasBeenWrong: true } // 用户输入的错误词
        } else if (wLower === correctWord) {
          return { ...w, status: 'wrongAnswer', hasBeenWrong: true } // 正确答案词
        }
        return w
      }))

      // 同步到后端（定制模式，只记录正确答案的错误状态）
      if (articleMode === 'custom' && articleId) {
        updateWordProgressToBackend(correctWord, 'wrong')
      }

      // 抖动
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setUserInput('')
      }, 500)
    }
  }

  // 同步单词进度到后端
  const updateWordProgressToBackend = async (word, state) => {
    try {
      await fetch('/api/article/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          articleId,
          word,
          state
        })
      })
    } catch (err) {
      console.error('同步单词进度失败:', err)
      // 不阻塞用户继续答题
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div className="article-study-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>正在加载文章...</p>
      </div>
    )
  }

  // 错误状态
  if (error) {
    let errorTitle = ''
    let errorMessage = ''
    
    switch (error) {
      case 'NOT_UNLOCKED':
        errorTitle = '🔒 定制文章未解锁'
        errorMessage = '请学习满16个单词后再试，或选择通用模式'
        break
      case 'NO_WORDS':
        errorTitle = '🎉 你背的单词已经学完啦！'
        errorMessage = '去刷单词或继续文章题目，或者返回主界面'
        break
      case 'NO_GENERIC':
        errorTitle = '😢 没有可用的通用文章'
        errorMessage = '请联系管理员添加文章模板'
        break
      default:
        errorTitle = '😢 文章加载失败'
        errorMessage = '请稍后重试'
    }
    
    return (
      <div className="article-study-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: error === 'NO_WORDS' ? '#333' : '#ef4444' }}>{errorTitle}</h2>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>{errorMessage}</p>
        
        <button 
            onClick={onNavigate}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            返回主页
        </button>
      </div>
    )
  }

  if (!article || questions.length === 0) {
    return <div className="loading">加载中...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((Object.keys(answeredQuestions).length / questions.length) * 100).toFixed(0)

  return (
    <div className="article-study-page">
      {/* 顶部导航 */}
      <div className="study-header">
        <button className="back-btn" onClick={onNavigate}>←</button>
        <div className="progress-text">
          {Object.keys(answeredQuestions).length} / {questions.length}
          <span style={{ marginLeft: '10px', fontSize: '0.9em', opacity: 0.7 }}>
            ({articleMode === 'generic' ? '通用' : '定制'})
          </span>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="article-study-content">
        {/* 左侧：文章区 */}
        <div className="article-section">
          <h2 className="article-title">{article.title}</h2>
          <div className="article-body">
            {renderArticle(
              article.content, 
              questions, 
              currentQuestionIndex, 
              answeredQuestions,
              userInput,
              isShaking
            )}
          </div>

          {/* 答题提示 */}
          <div className="control-hints">
            💡 直接输入单词，按 <kbd>Enter</kbd> 提交 · <kbd>Backspace</kbd> 删除
          </div>
        </div>

        {/* 右侧：单词库 */}
        <div className="word-bank-section">
          <WordBank words={wordBank} showMeaning={showMeaning} onToggleMeaning={() => setShowMeaning(!showMeaning)} />
        </div>
      </div>


    </div>
  )
}

// 解析文章（适配 [word] 格式）
function parseArticle(content, wordBank) {
  const questions = []
  const regex = /\[([a-zA-Z]+)\]/g
  let match
  let questionIndex = 0

  // 创建单词到释义的映射
  const wordMeaningMap = {}
  wordBank.forEach(item => {
    wordMeaningMap[item.word.toLowerCase()] = item.meaning
  })

  while ((match = regex.exec(content)) !== null) {
    const word = match[1]
    const meaning = wordMeaningMap[word.toLowerCase()] || ''
    
    questions.push({
      id: questionIndex++,
      word: word,
      position: match.index,
      meaning: meaning,
      correctAnswer: word
    })
  }

  return questions
}

// 渲染文章（替换中括号）
function renderArticle(content, questions, currentIndex, answeredQuestions, userInput, isShaking) {
  const parts = []
  let lastIndex = 0

  questions.forEach((q, i) => {
    // 中括号之前的文本
    parts.push(
      <span key={`text-${i}`}>
        {content.substring(lastIndex, q.position)}
      </span>
    )

    // 交互式单词
    const status = answeredQuestions[i]
    const isCurrent = i === currentIndex

    parts.push(
      <InteractiveWord
        key={`word-${i}`}
        word={q.word}
        isCurrent={isCurrent}
        status={status}
        userInput={isCurrent ? userInput : ''}
        isShaking={isCurrent ? isShaking : false}
      />
    )

    // 跳过中括号
    const bracketEnd = content.indexOf(']', q.position) + 1
    lastIndex = bracketEnd
  })

  // 最后剩余文本
  parts.push(
    <span key="text-end">
      {content.substring(lastIndex)}
    </span>
  )

  return parts
}

// 交互式单词组件
function InteractiveWord({ word, isCurrent, status, userInput, isShaking }) {
  if (status === 'correct') {
    return <span className="word-answered correct">✓ {word}</span>
  }
  
  if (isCurrent) {
    return (
      <span className={`word-current ${isShaking ? 'shake-error' : ''} ${userInput && !isShaking ? 'has-input' : ''}`}>
        {userInput || '_______'}
      </span>
    )
  }
  
  return <span className="word-pending">_____</span>
}

// 单词库组件
function WordBank({ words, showMeaning, onToggleMeaning }) {
  return (
    <div className="word-bank-container">
      <div className="word-bank-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="bank-icon">📝</span>
          <span>单词库</span>
        </div>
        <div 
          className="meaning-toggle"
          onClick={onToggleMeaning}
          title={showMeaning ? '隐藏中文' : '显示中文'}
        >
          <span style={{ fontSize: '12px', marginRight: '6px' }}>中</span>
          <div className={`toggle-switch-small ${showMeaning ? 'active' : ''}`}>
            <div className="toggle-slider-small"></div>
          </div>
        </div>
      </div>
      <div className="word-bank-grid">
        {words.map((word, index) => (
          <motion.div
            key={word.word}
            className={`bank-card ${word.status}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            {/* 暗黄色小点标记 */}
            {word.hasBeenWrong && (
              <div className="wrong-dot"></div>
            )}
            <div className="bank-word">{word.word}</div>
            {showMeaning && <div className="bank-meaning">{word.meaning}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ArticleStudyPage
