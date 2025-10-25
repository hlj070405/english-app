import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HomePage.css'
import defaultAvatar from './Iconfont.svg'
import backgroundImage from './background.jpg'

function HomePage({ user, onLogout, onNavigate, onNavigateArticle }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [showShine, setShowShine] = useState(false)
  const [articleMode, setArticleMode] = useState('generic') // 'generic' 或 'custom'

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true)
      setShowShine(true)
      // 动画1秒，在0.99秒时移除扫光层
      setTimeout(() => setShowShine(false), 990)
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

          {/* 用户信息卡片 */}
          <motion.div 
            className="user-card neon-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="user-info">
              <div className="avatar">🎯</div>
              <div className="user-details">
                <h2>学习者_001</h2>
                <div className="level-badge">
                  <span className="level-text">等级 12</span>
                  <span className="level-icon">▸▸▸</span>
                </div>
              </div>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: '60%' }}></div>
            </div>
            <div className="xp-text">1,240 / 2,000 经验</div>
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
                  <div className="streak-number">12</div>
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
                <div className="stat-value">3</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💎</div>
                <div className="stat-value">5</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">2</div>
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
              <span className="rank">#15</span>
              <span className="change">↑3</span>
              <span className="points">1,234 经验</span>
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
            <div className="quest-header">
              <span className="quest-icon">⚡</span>
              <span className="quest-title">单词卡片</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>20个新词</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>翻转学习</span>
              </div>
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
            <div className="quest-header">
              <span className="quest-icon">📝</span>
              <span className="quest-title">文章模式</span>
            </div>
            
            {/* 嵌入式切换开关 */}
            <div className="toggle-container-inline">
              <span className={`toggle-label ${articleMode === 'generic' ? 'active' : ''}`}>通用</span>
              <div 
                className="toggle-switch"
                onClick={(e) => {
                  e.stopPropagation()
                  setArticleMode(articleMode === 'generic' ? 'custom' : 'generic')
                }}
              >
                <div className={`toggle-slider ${articleMode === 'custom' ? 'active' : ''}`}></div>
              </div>
              <span className={`toggle-label ${articleMode === 'custom' ? 'active' : ''}`}>定制</span>
            </div>
            
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>阅读文章</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>填空练习</span>
              </div>
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
            onClick={() => alert('我的词库功能开发中...')}
          >
            <div className="shine-effect"></div>
            <div className="quest-header">
              <span className="quest-icon">📚</span>
              <span className="quest-title">我的词库</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>已掌握单词</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>复习管理</span>
              </div>
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
            onClick={() => alert('真题练习功能开发中...')}
          >
            <div className="shine-effect"></div>
            <div className="quest-header">
              <span className="quest-icon">🎯</span>
              <span className="quest-title">真题练习</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>历年真题</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>模拟考试</span>
              </div>
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
