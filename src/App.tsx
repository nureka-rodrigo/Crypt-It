import './App.css'
import {Route, Routes} from "react-router-dom";
import {Home} from "@/pages/Home.tsx";
import {Caesar} from "@/pages/Caesar.tsx";

function App() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/substitution/caesar" element={<Caesar/>}/>
      </Routes>
    </div>
  )
}

export default App
