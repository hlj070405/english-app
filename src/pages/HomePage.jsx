import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HomePage.css'
import defaultAvatar from './Iconfont.svg';

function HomePage({ user, onLogout, onNavigate, onNavigateArticle }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [showShine, setShowShine] = useState(false)

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true)
      setShowShine(true)
      // 动画1秒，在0.99秒时移除扫光层
      setTimeout(() => setShowShine(false), 990)
    }
  }

  return (
    <div className="home-page">
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
                <h2>LEARNER_001</h2>
                <div className="level-badge">
                  <span className="level-text">LEVEL 12</span>
                  <span className="level-icon">▸▸▸</span>
                </div>
              </div>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: '60%' }}></div>
            </div>
            <div className="xp-text">1,240 / 2,000 XP</div>
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
                    <span className="streak-label">STREAK</span>
                  </div>
                  <div className="streak-number">12</div>
                  <div className="streak-text">DAYS</div>
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
              <span>LEADERBOARD</span>
              <span className="leader-arrow">▸</span>
            </div>
            <div className="leader-stats">
              <span className="rank">#15</span>
              <span className="change">↑3</span>
              <span className="points">1,234 XP</span>
            </div>
          </motion.div>
        </div>

        {/* 右侧区域 - 每日任务 */}
        <div className="right-section">
          <motion.div 
            className="quest-card gradient-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onNavigate}
          >
            <div className="shine-effect"></div>
            <div className="quest-header">
              <span className="quest-icon">⚡</span>
              <span className="quest-title">WORD CARDS</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>20 NEW WORDS</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>FLIP & LEARN</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>KEYBOARD FAST</span>
              </div>
            </div>
            <button className="quest-btn">
              <span>START</span>
              <span className="btn-arrow">▸</span>
            </button>
          </motion.div>

          {/* 文章学习卡片 */}
          <motion.div 
            className="article-card gradient-card-alt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onNavigateArticle}
          >
            <div className="shine-effect"></div>
            <div className="quest-header">
              <span className="quest-icon">📝</span>
              <span className="quest-title">ARTICLE MODE</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>READ ARTICLE</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>FILL BLANKS</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>COLLECT CARDS</span>
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
