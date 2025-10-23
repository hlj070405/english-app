import { motion } from 'framer-motion'
import './HomePage.css'

function HomePage({ onNavigate }) {
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
              <button className="icon-btn">🔔</button>
              <button className="icon-btn">👤</button>
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

          {/* 连续打卡 & 能力值 */}
          <div className="stats-row">
            <motion.div 
              className="streak-card neon-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="streak-header">
                <span className="streak-icon">🔥</span>
                <span className="streak-label">STREAK</span>
              </div>
              <div className="streak-number">12</div>
              <div className="streak-text">DAYS</div>
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
              <span className="quest-title">DAILY QUEST</span>
            </div>
            <div className="quest-list">
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>20 NEW WORDS</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>SPEAK 5 MIN</span>
              </div>
              <div className="quest-item">
                <span className="quest-bullet">▸</span>
                <span>READ ARTICLE</span>
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

export default HomePage
