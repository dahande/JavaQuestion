import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { PageTransition } from './components/PageTransition'
import { HomePage } from './pages/HomePage'
import { CoursePage } from './pages/CoursePage'
import { LessonPage } from './pages/LessonPage'

export default function App() {
  const location = useLocation()
  return (
    <div className="app">
      <Header />
      <main className="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <PageTransition>
                  <CoursePage />
                </PageTransition>
              }
            />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={
                <PageTransition>
                  <LessonPage />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="footer">
        <p>JavaLearn — ブラウザで学ぶJava入門 / 学習用デモアプリ</p>
      </footer>
    </div>
  )
}
