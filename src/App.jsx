import Navbar from './Navbar'
import WaveMesh from './WaveMesh'
import Portfolio from './Portfolio'
import './App.css'

function App() {
  return (
    <>
      {/* Fixed 3D background — z-index: 0 */}
      <WaveMesh />

      {/* Fixed navbar — z-index: 50 */}
      <Navbar />

      {/* Scrollable foreground content — z-index: 10 */}
      <main className="app-content">
        <Portfolio />
      </main>
    </>
  )
}

export default App
