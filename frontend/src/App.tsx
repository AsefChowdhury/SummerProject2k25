import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/main-layout/MainLayout";
import SignIn from './authentication/SignIn'
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
          <Route path="/signin" element={<SignIn/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
