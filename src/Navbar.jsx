import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Clock</div>
      <ul className="navbar-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
