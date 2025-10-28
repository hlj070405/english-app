import { useState } from 'react'
import { motion } from 'framer-motion'
import './ExamPracticePage.css'

function ExamPracticePage({ onBack }) {
  const [selectedExam, setSelectedExam] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const exams = [
    { id: 1, title: '2025年6月大学英语四级真题（第一套）', pdfUrl: '/exams/cet4_2025_06_1.pdf', answerUrl: '/exams/cet4_2025_06_1_ans.pdf' },
    { id: 2, title: '2025年6月大学英语四级真题（第二套）', pdfUrl: '/exams/cet4_2025_06_2.pdf', answerUrl: '/exams/cet4_2025_06_2_ans.pdf' },
    { id: 3, title: '2025年6月大学英语四级真题（第三套）', pdfUrl: '/exams/cet4_2025_06_3.pdf', answerUrl: '/exams/cet4_2025_06_3_ans.pdf' },
    { id: 4, title: '2024年12月大学英语四级真题（第一套）', pdfUrl: '/exams/cet4_2024_12_1.pdf', answerUrl: '/exams/cet4_2024_12_1_ans.pdf' },
    { id: 5, title: '2024年12月大学英语四级真题（第二套）', pdfUrl: '/exams/cet4_2024_12_2.pdf', answerUrl: '/exams/cet4_2024_12_2_ans.pdf' },
    { id: 6, title: '2024年12月大学英语四级真题（第三套）', pdfUrl: '/exams/cet4_2024_12_3.pdf', answerUrl: '/exams/cet4_2024_12_3_ans.pdf' },
    { id: 7, title: '2024年6月大学英语四级真题（第一套）', pdfUrl: '/exams/cet4_2024_06_1.pdf', answerUrl: '/exams/cet4_2024_06_1_ans.pdf' },
    { id: 8, title: '2024年6月大学英语四级真题（第二套）', pdfUrl: '/exams/cet4_2024_06_2.pdf', answerUrl: '/exams/cet4_2024_06_2_ans.pdf' },
    { id: 9, title: '2024年6月大学英语四级真题（第三套）', pdfUrl: '/exams/cet4_2024_06_3.pdf', answerUrl: '/exams/cet4_2024_06_3_ans.pdf' },
    { id: 10, title: '2023年12月大学英语四级真题（第一套）', pdfUrl: '/exams/cet4_2023_12_1.pdf', answerUrl: '/exams/cet4_2023_12_1_ans.pdf' },
    { id: 11, title: '2023年12月大学英语四级真题（第二套）', pdfUrl: '/exams/cet4_2023_12_2.pdf', answerUrl: '/exams/cet4_2023_12_2_ans.pdf' },
    { id: 12, title: '2023年12月大学英语四级真题（第三套）', pdfUrl: '/exams/cet4_2023_12_3.pdf', answerUrl: '/exams/cet4_2023_12_3_ans.pdf' },
  ]

  return (
    <div className="exam-page">
      {!selectedExam ? (
        <div className="exam-list-container">
          <div className="exam-list">
            <motion.div className="exam-back-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onBack}>
              <div className="back-icon">←</div>
              <div className="back-text">返回首页</div>
            </motion.div>
            
            {exams.map((exam, index) => (
              <motion.div
                key={exam.id}
                className="exam-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedExam(exam)}
              >
                <div className="exam-icon">📄</div>
                <div className="exam-info">
                  <div className="exam-title">{exam.title}</div>
                  <div className="exam-hint">点击查看真题</div>
                </div>
                <div className="exam-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pdf-viewer-container">
          <div className="pdf-header">
            <button className="pdf-back-btn" onClick={() => { setSelectedExam(null); setShowAnswer(false); }}>
              ← 返回列表
            </button>
            <h3>{selectedExam.title}</h3>
            <button className="answer-toggle-btn" onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? '📖 查看真题' : '📝 查看答案'}
            </button>
          </div>
          <div className="pdf-content">
            <object data={showAnswer ? selectedExam.answerUrl : selectedExam.pdfUrl} type="application/pdf" className="pdf-object">
              <div className="pdf-not-supported">
                <div className="not-supported-content">
                  <h3>📄 PDF 查看器</h3>
                  <p>您的浏览器不支持在线预览 PDF，请下载后查看。</p>
                  <div className="download-buttons">
                    <a href={selectedExam.pdfUrl} download className="download-link">📝 下载真题</a>
                    <a href={selectedExam.answerUrl} download className="download-link">✅ 下载答案</a>
                  </div>
                  <p className="hint-text">或者尝试使用 Chrome、Edge 等现代浏览器打开</p>
                </div>
              </div>
            </object>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamPracticePage
