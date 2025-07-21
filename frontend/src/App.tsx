import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/MainLayout";
import SignIn from './authentication/SignIn'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/signin" element={<SignIn/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
