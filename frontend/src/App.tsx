import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/main-layout/MainLayout";
import AuthPage from './authentication/AuthPage'
import MyFlashcards from "./flashcards/MyFlashcards";
import MyQuizzes from "./quizzes/MyQuizzes";
import MyNotes from "./notes/MyNotes";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicRoute from "./authentication/PublicRoute";
import LandingPage from "./core-pages/LandingPage";
import AboutUs from "./core-pages/AboutUs";
import ContactUs from "./core-pages/ContactUs";
import CorePagesLayout from "./layouts/core-pages-layout/CorePagesLayout";
import ManageNotes from "./notes/ManageNotes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}/>
          <Route element={<CorePagesLayout/>}>
            <Route index element={<LandingPage/>}></Route>
            <Route path="/about-us" element={<AboutUs/>}></Route>
            <Route path="/contact-us" element={<ContactUs/>}></Route>
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashcards" element={<MyFlashcards />} />
            <Route path="/quizzes" element={<MyQuizzes />} />
            <Route path="/notes" element={<MyNotes />} />
          </Route>
          <Route path="/sign-in" element={<PublicRoute><AuthPage mode="sign-in"/></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute><AuthPage mode="sign-up"/></PublicRoute>} />
          <Route path="/manage-notes" element={<ManageNotes/>} />
        </Routes>
      </BrowserRouter>
    </>
  ) 
}

export default App
