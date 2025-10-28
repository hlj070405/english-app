import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HomePage.css'
import './AIChatStyles.css'
import defaultAvatar from './Iconfont.svg'
import backgroundImage from './background.jpg'

function HomePage({ user, onLogout, onNavigate, onNavigateArticle, articleMode = 'generic', onArticleModeChange }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [showShine, setShowShine] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [userStats, setUserStats] = useState({
    streakDays: 0,
    coins: 0,
    gems: 0,
    totalWordsLearned: 0,
    rank: 0,
    rankChange: 0,
    exp: 0
  })

  // 加载用户统计数据
  useEffect(() => {
    fetchUserStats()
    fetchLeaderboard()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUserStats(prev => ({ ...prev, ...data }))
        setIsCheckedIn(data.hasCheckedInToday)
      }
    } catch (err) {
      console.error('获取用户统计失败:', err)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/user/leaderboard', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUserStats(prev => ({ ...prev, ...data }))
      }
    } catch (err) {
      console.error('获取排行榜失败:', err)
    }
  }

  const handleCheckIn = async () => {
    if (isCheckedIn) return

    try {
      const response = await fetch('/api/user/checkin', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setIsCheckedIn(true)
        setShowShine(true)
        setTimeout(() => setShowShine(false), 990)
        
        // 更新统计数据
        setUserStats(prev => ({
          ...prev,
          streakDays: data.streakDays,
          coins: data.coins,
          gems: data.gems
        }))
        
        // 显示奖励提示（可选）
        console.log('签到成功！', data)
      } else {
        const error = await response.json()
        alert(error.message || '签到失败')
      }
    } catch (err) {
      console.error('签到错误:', err)
      alert('签到失败，请稍后再试')
    }
  }

  // 跳转到 AI 聊天页面
  const handleAskAI = () => {
    if (aiQuestion.trim()) {
      onNavigate('ai-chat', aiQuestion.trim())
    }
  }

  return (
    <div className="home-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* 网格背景 */}
      <div className="grid-background"></div>
      
      {/* 主容器 - Grid布局 */}
      <div className="home-container">
        
        {/* 左侧区域 */}
        <div className="left-section">
          {/* 顶部导航 */}
          <div className="top-nav">
            <div className="logo">
              <span className="logo-slash">///</span>
              <span className="logo-text">EnglishAI</span>
            </div>
            <div className="nav-actions">
              <UserAvatar user={user} onLogout={onLogout} />
            </div>
          </div>

          {/* AI 问答快捷入口 */}
          <motion.div 
            className="ai-quick-search neon-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="search-icon"></div>
            <input
              type="text"
              className="ai-search-input"
              placeholder="问 AI 任何英语问题..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button 
              className="ai-search-button"
              onClick={handleAskAI}
              disabled={!aiQuestion.trim()}
            >
              →
            </button>
          </motion.div>

          {/* 签到卡片 & 能力值 */}
          <div className="stats-row">
            <motion.div 
              className={`streak-card ${isCheckedIn ? 'checked-in' : 'unchecked'} ${showShine ? 'shine-once' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleCheckIn}
            >
              {showShine && <div className="shine-effect-once"></div>}
              
              {!isCheckedIn ? (
                // 未签到状态 - 金色
                <div className="checkin-prompt">
                  <span className="checkin-icon">✨</span>
                  <span className="checkin-text">点击签到</span>
                </div>
              ) : (
                // 已签到状态
                <>
                  <div className="streak-header">
                    <span className="streak-icon">🔥</span>
                    <span className="streak-label">连续签到</span>
                  </div>
                  <div className="streak-number">{userStats.streakDays}</div>
                  <div className="streak-text">天</div>
                </>
              )}
            </motion.div>

            <motion.div 
              className="power-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div className="stat-value">{userStats.coins}</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💎</div>
                <div className="stat-value">{userStats.gems}</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{userStats.totalWordsLearned}</div>
              </div>
            </motion.div>
          </div>

          {/* 排行榜 */}
          <motion.div 
            className="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="leaderboard-header">
              <span className="leader-slash">///</span>
              <span>排行榜</span>
              <span className="leader-arrow">▸</span>
            </div>
            <div className="leader-stats">
              <span className="rank">#{userStats.rank}</span>
              <span className="change">
                {userStats.rankChange > 0 ? `↑${userStats.rankChange}` : 
                 userStats.rankChange < 0 ? `↓${Math.abs(userStats.rankChange)}` : '-'}
              </span>
              <span className="points">{userStats.exp.toLocaleString()} 经验</span>
            </div>
          </motion.div>
        </div>

        {/* 右侧区域 - 学习模块 */}
        <div className="right-section">
          {/* WORD CARDS */}
          <motion.div 
            className="quest-card-small gradient-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onNavigate}
          >
            <div className="shine-effect"></div>
            <div className="quest-header-center">
              <span className="quest-title">单词卡片</span>
            </div>
            <div className="quest-description">
              通过翻转卡片学习或复习 20 个单词
            </div>
            <div className="quest-description">
              你会经常看到你的生词~复习巩固吧
            </div>

            <button className="quest-btn">
              <span>START</span>
              <span className="btn-arrow">▸</span>
            </button>
          </motion.div>

          {/* ARTICLE MODE */}
          <motion.div 
            className="quest-card-small gradient-card-alt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="shine-effect"></div>
            <div className="quest-header-center">
              <span className="quest-title">文章模式</span>
            </div>
            
            {/* 嵌入式切换开关 */}
            <div className="toggle-container-inline">
              <span className={`toggle-label ${articleMode === 'generic' ? 'active' : ''}`}>通用</span>
              <div 
                className="toggle-switch"
                onClick={(e) => {
                  e.stopPropagation()
                  const nextMode = articleMode === 'generic' ? 'custom' : 'generic'
                  onArticleModeChange?.(nextMode)
                }}
              >
                <div className={`toggle-slider ${articleMode === 'custom' ? 'active' : ''}`}></div>
              </div>
              <span className={`toggle-label ${articleMode === 'custom' ? 'active' : ''}`}>定制</span>
            </div>
            
            <div className="quest-description">
              通过阅读文章和填空练习提升熟练程度
              
            </div>
            <div className="quest-description">
              
              定制文章会根据你的生词精心设计~
            </div>
            <button className="quest-btn" onClick={() => onNavigateArticle(articleMode)}>
              <span>START</span>
              <span className="btn-arrow">▸</span>
            </button>
          </motion.div>

          {/* 我的词库 */}
          <motion.div 
            className="quest-card-small gradient-card-purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => onNavigate('vocabulary')}
          >
            <div className="shine-effect"></div>
            <div className="quest-header-center">
              <span className="quest-title">我的词库</span>
            </div>
            <div className="quest-description">
              查看已掌握的单词，管理复习计划，巩固学习成果
            </div>
            <button className="quest-btn">
              <span>START</span>
              <span className="btn-arrow">▸</span>
            </button>
          </motion.div>

          {/* 真题练习 */}
          <motion.div 
            className="quest-card-small gradient-card-orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => onNavigate('exam')}
          >
            <div className="shine-effect"></div>
            <div className="quest-header-center">
              <span className="quest-title">真题练习</span>
            </div>
            <div className="quest-description">
              通过历年真题和模拟考试，检验学习成果和应试能力
            </div>
            <button className="quest-btn">
              <span>START</span>
              <span className="btn-arrow">▸</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// 自定义Hook：点击外部区域时触发回调
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

// 用户头像和下拉菜单组件
const UserAvatar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  return (
    <div className="user-avatar-container" ref={menuRef}>
      <motion.img
        src={user.avatar || defaultAvatar}
        alt="User Avatar"
        className="user-avatar"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="menu-header">
              <strong>{user.nickname || user.username}</strong>
              <p>{user.email}</p>
            </div>
            <div className="menu-item">个人资料</div>
            <div className="menu-item">设置</div>
            <div className="menu-item logout" onClick={onLogout}>
              登出
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage
