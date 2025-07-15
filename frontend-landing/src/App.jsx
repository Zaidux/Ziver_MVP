import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Solutions from "./components/Solutions"
import You from "./components/You"
import Faq from "./components/Faq"
import Footer from "./components/footer"

function App() {

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Solutions />
      <You />
      <Faq />
      <Footer />
    </div>
  )
}

export default App;
