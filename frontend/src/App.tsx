import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/main-layout/MainLayout";
import AuthPage from './authentication/AuthPage'
import MyFlashcards from "./flashcards/MyFlashcards";
import MyQuizzes from "./quizzes/MyQuizzes";
import MyNotes from "./notes/MyNotes";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicRoute from "./authentication/PublicRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashcards" element={<MyFlashcards />} />
            <Route path="/quizzes" element={<MyQuizzes />} />
            <Route path="/notes" element={<MyNotes />} />
          </Route>
          <Route path="/sign-in" element={<PublicRoute><AuthPage mode="sign-in"/></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute><AuthPage mode="sign-up"/></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
