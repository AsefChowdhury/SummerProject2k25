import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/main-layout/MainLayout";
import AuthPage from './authentication/AuthPage'
import MyFlashcards from "./flashcards/MyFlashcards";
import MyQuizzes from "./quizzes/MyQuizzes";
import MyNotes from "./notes/MyNotes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/flashcards" element={<MyFlashcards />} />
            <Route path="/quizzes" element={<MyQuizzes />} />
            <Route path="/notes" element={<MyNotes />} />
          </Route>
          <Route path="/signin" element={<AuthPage mode="sign-in"/>} />
          <Route path="/signup" element={<AuthPage mode="sign-up"/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
