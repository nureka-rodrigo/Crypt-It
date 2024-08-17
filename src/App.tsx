import './App.css'
import Navbar from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";

function App() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar/>
      <Footer/>
    </div>
  )
}

export default App
