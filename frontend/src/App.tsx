import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from './dashboard/Dashboard';
import './App.css';
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
