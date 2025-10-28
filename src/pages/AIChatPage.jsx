import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './AIChatPage.css'

function AIChatPage({ initialQuestion, onBack }) {
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  const chatEndRef = useRef(null)
  const hasAskedInitialQuestion = useRef(false)

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isAiThinking])

  // 如果有初始问题，自动发送（只发送一次）
  useEffect(() => {
    if (initialQuestion && !hasAskedInitialQuestion.current) {
      hasAskedInitialQuestion.current = true
      handleSendMessage(initialQuestion)
    }
  }, [initialQuestion])

  // 发送消息给 AI
  const handleSendMessage = async (message = null) => {
    const messageToSend = message || userInput.trim()
    if (!messageToSend || isAiThinking) return

    setUserInput('')
    
    // 添加用户消息
    setChatMessages(prev => [...prev, { role: 'user', content: messageToSend }])
    setIsAiThinking(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: messageToSend })
      })

      if (!response.ok) {
        throw new Error('AI 回复失败')
      }

      const data = await response.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('AI 聊天错误:', err)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我遇到了一些问题。请稍后再试。' 
      }])
    } finally {
      setIsAiThinking(false)
    }
  }

  return (
    <div className="ai-chat-page">
      {/* 顶部导航 */}
      <div className="chat-nav">
        <button className="back-button" onClick={onBack}>
          ← 返回
        </button>
        <div className="chat-title">
          <span className="ai-icon">🤖</span>
          <h2>AI 学习助手</h2>
        </div>
        <div className="chat-status">在线</div>
      </div>

      {/* 聊天消息区 */}
      <div className="chat-container">
        <div className="chat-messages-full">
          {chatMessages.length === 0 && !isAiThinking && (
            <div className="chat-welcome-full">
              <div className="welcome-icon">👋</div>
              <h3>你好！我是你的 AI 学习助手</h3>
              <p>有什么英语问题尽管问我！</p>
            </div>
          )}
          
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              className={`chat-message-full ${msg.role}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-bubble">{msg.content}</div>
            </motion.div>
          ))}
          
          {isAiThinking && (
            <motion.div
              className="chat-message-full assistant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message-avatar">🤖</div>
              <div className="message-bubble thinking">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </motion.div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 底部输入区 */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input-full"
          placeholder="输入你的问题..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isAiThinking}
        />
        <button 
          className="send-button-full"
          onClick={() => handleSendMessage()}
          disabled={isAiThinking || !userInput.trim()}
        >
          发送
        </button>
      </div>
    </div>
  )
}

export default AIChatPage
