import { NavLink } from "react-router-dom"

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item">
        <span>⌂</span>
        <small>Home</small>
      </NavLink>

      <NavLink to="/dairy" className="nav-item">
        <span>◉</span>
        <small>Dairy</small>
      </NavLink>

      <div className="nav-space" />

      <NavLink to="/farm" className="nav-item">
        <span>▦</span>
        <small>Farm</small>
      </NavLink>

      <NavLink to="/more" className="nav-item">
        <span>•••</span>
        <small>More</small>
      </NavLink>
    </nav>
  )
}

export default BottomNav