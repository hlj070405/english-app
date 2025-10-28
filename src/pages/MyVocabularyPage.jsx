import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './MyVocabularyPage.css'

function MyVocabularyPage({ onBack }) {
  const [words, setWords] = useState([])
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    weakWords: 0
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMeaning, setShowMeaning] = useState(true)

  useEffect(() => {
    fetchVocabulary()
    fetchStats()
  }, [currentPage])

  const fetchVocabulary = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/vocabulary/my-words?page=${currentPage}&size=50`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setWords(data.words)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('获取词库错误:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/vocabulary/stats', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('获取统计信息错误:', err)
    }
  }

  const getMasteryColor = (level) => {
    switch (level) {
      case '已掌握': return '#4ade80'
      case '学习中': return '#60a5fa'
      case '初识': return '#fbbf24'
      case '生词': return '#f87171'
      default: return '#9ca3af'
    }
  }

  return (
    <div className="vocabulary-page">
      <div className="vocab-nav">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h2>我的词库</h2>
        <div className="vocab-toggle">
          <label className="toggle-label-vocab">
            <input type="checkbox" checked={showMeaning} onChange={(e) => setShowMeaning(e.target.checked)} />
            <span>显示释义</span>
          </label>
        </div>
      </div>

      <div className="vocab-stats-container">
        <div className="vocab-stat-card">
          <div className="stat-label">总词汇:</div>
          <div className="stat-number">{stats.totalWords}</div>
        </div>
        <div className="vocab-stat-card mastered">
          <div className="stat-label">已掌握:</div>
          <div className="stat-number">{stats.masteredWords}</div>
        </div>
        <div className="vocab-stat-card learning">
          <div className="stat-label">学习中:</div>
          <div className="stat-number">{stats.learningWords}</div>
        </div>
        <div className="vocab-stat-card weak">
          <div className="stat-label">需复习:</div>
          <div className="stat-number">{stats.weakWords}</div>
        </div>
      </div>

      <div className="vocab-list-container">
        {loading ? (
          <div className="loading-text">加载中...</div>
        ) : words.length === 0 ? (
          <div className="empty-text">还没有学习过单词，快去学习吧！</div>
        ) : (
          <div className="vocab-list">
            {words.map((item, index) => (
              <motion.div
                key={item.id}
                className="vocab-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="vocab-item-header">
                  <div className="vocab-word-section">
                    <span className="vocab-word">{item.word}</span>
                    {item.phonetic && <span className="vocab-phonetic">{item.phonetic}</span>}
                  </div>
                  <div className="vocab-mastery-section">
                    <span className="mastery-badge" style={{ backgroundColor: getMasteryColor(item.masteryLevel) }}>
                      {item.masteryLevel}
                    </span>
                    <span className="mastery-score">{item.masteryScore.toFixed(1)}</span>
                  </div>
                </div>
                {showMeaning && (
                  <div className="vocab-item-content">
                    <div className="vocab-translation">{item.translation}</div>
                    {item.exampleSentence && <div className="vocab-example">{item.exampleSentence}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
            上一页
          </button>
          <span className="page-info">{currentPage + 1} / {totalPages}</span>
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}>
            下一页
          </button>
        </div>
      )}
    </div>
  )
}

export default MyVocabularyPage
