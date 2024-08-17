import './App.css'
import {Route, Routes} from "react-router-dom";
import {Home} from "@/pages/Home.tsx";
import {Caesar} from "@/pages/Caesar.tsx";
import {Monoalphabetic} from "@/pages/Monoalphabetic.tsx";
import {Playfair} from "@/pages/Playfair.tsx";

function App() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/substitution/caesar" element={<Caesar/>}/>
        <Route path="/substitution/monoalphabetic" element={<Monoalphabetic/>}/>
        <Route path="/substitution/playfair" element={<Playfair/>}/>
      </Routes>
    </div>
  )
}

export default App
