import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ArticleStudyPage.css'

// 测试数据
const TEST_ARTICLE = {
  title: "The Power of Innovation",
  content: `In today's fast-paced world, technology continues to evolve at an [unprecedented,史无前例的,传统的,缓慢的] rate. The [persistence,坚持,放弃,犹豫] of scientists has led to breakthrough discoveries that transform our lives.

Companies must show [dedication,奉献,利润,规模] to stay competitive in the market. Recent [innovation,创新,传统,历史] has made communication easier and more efficient. Success requires both [courage,勇气,金钱,运气] and hard work.

Through continuous learning and [adaptation,适应,拒绝,忽视], we can embrace the changes that technology brings to our daily lives.`
}

function ArticleStudyPage({ onNavigate }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('') // 用户输入
  const [answeredQuestions, setAnsweredQuestions] = useState({})
  // 单词库（供用户选择的单词）
  const [wordBank, setWordBank] = useState([
    { word: 'unprecedented', meaning: '史无前例的', status: 'unused', hasBeenWrong: false }, // unused, correct, wrong, wrongAnswer
    { word: 'persistence', meaning: '坚持', status: 'unused', hasBeenWrong: false },
    { word: 'dedication', meaning: '奉献', status: 'unused', hasBeenWrong: false },
    { word: 'innovation', meaning: '创新', status: 'unused', hasBeenWrong: false },
    { word: 'courage', meaning: '勇气', status: 'unused', hasBeenWrong: false },
    { word: 'adaptation', meaning: '适应', status: 'unused', hasBeenWrong: false },
    { word: 'achievement', meaning: '成就', status: 'unused', hasBeenWrong: false },
    { word: 'confidence', meaning: '信心', status: 'unused', hasBeenWrong: false }
  ])
  const [isShaking, setIsShaking] = useState(false) // 抖动状态

  // 解析文章内容
  useEffect(() => {
    const parsed = parseArticle(TEST_ARTICLE.content)
    setQuestions(parsed)
  }, [])

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

    const isCorrect = inputWord === correctWord

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

      // 清空输入
      setUserInput('')

      // 快速跳到下一题
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }, 100) // 100ms延迟，体验更好
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

      // 抖动
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setUserInput('')
      }, 500)
    }
  }

  if (questions.length === 0) {
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
        </div>
      </div>

      {/* 主要内容 */}
      <div className="article-study-content">
        {/* 左侧：文章区 */}
        <div className="article-section">
          <h2 className="article-title">{TEST_ARTICLE.title}</h2>
          <div className="article-body">
            {renderArticle(
              TEST_ARTICLE.content, 
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
          <WordBank words={wordBank} />
        </div>
      </div>


    </div>
  )
}

// 解析文章
function parseArticle(content) {
  const questions = []
  const regex = /\[(.*?)\]/g
  let match
  let questionIndex = 0

  while ((match = regex.exec(content)) !== null) {
    const parts = match[1].split(',').map(s => s.trim())
    
    if (parts.length >= 3) {
      const [word, ...options] = parts
      
      questions.push({
        id: questionIndex++,
        word: word,  // 英文单词
        position: match.index,
        options: options,  // 中文选项
        correctAnswer: word  // 正确答案是英文单词本身
      })
    }
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
function WordBank({ words }) {
  return (
    <div className="word-bank-container">
      <div className="word-bank-title">
        <span className="bank-icon">📝</span>
        <span>单词库</span>
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
            <div className="bank-meaning">{word.meaning}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ArticleStudyPage
