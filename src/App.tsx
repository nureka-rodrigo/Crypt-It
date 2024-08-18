import './App.css'
import {Route, Routes} from "react-router-dom";
import {Home} from "@/pages/Home.tsx";
import {Caesar} from "@/pages/substitution/Caesar.tsx";
import {Monoalphabetic} from "@/pages/substitution/Monoalphabetic.tsx";
import {Playfair} from "@/pages/substitution/Playfair.tsx";
import {Vigenere} from "@/pages/substitution/Vigenere.tsx";
import {Vernam} from "@/pages/substitution/Vernam.tsx";
import {RailFence} from "@/pages/transposition/RailFence.tsx";

function App() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/substitution/caesar" element={<Caesar/>}/>
        <Route path="/substitution/monoalphabetic" element={<Monoalphabetic/>}/>
        <Route path="/substitution/playfair" element={<Playfair/>}/>
        <Route path="/substitution/vigenere" element={<Vigenere/>}/>
        <Route path="/substitution/vernam" element={<Vernam/>}/>

        <Route path="/transposition/rail-fence" element={<RailFence/>}/>
      </Routes>
    </div>
  )
}

export default App
