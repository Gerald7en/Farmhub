import { Outlet } from "react-router-dom"
import BottomNav from "../components/navigation/BottomNav"

function AppLayout() {
  return (
    <div className="app">
      <main className="app-content">
        <Outlet />
      </main>

      <button className="add-button" aria-label="Add">
        +
      </button>

      <BottomNav />
    </div>
  )
}

export default AppLayout