import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { CoursePage } from './pages/CoursePage'
import { LessonPage } from './pages/LessonPage'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={<LessonPage />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>JavaLearn — ブラウザで学ぶJava入門 / 学習用デモアプリ</p>
      </footer>
    </div>
  )
}
