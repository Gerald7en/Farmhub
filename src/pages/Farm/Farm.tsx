function Farm() {
  return (
    <div className="page">
      <p className="eyebrow">THE FARM</p>

      <h1 className="page-title">Farm</h1>

      <p className="page-description">
        Everything else happening around Mum's farm.
      </p>

      <div className="farm-menu">
        <button className="farm-menu-card">
          <span>🐔</span>
          <div>
            <h2>Poultry</h2>
            <p>Birds & chicks</p>
          </div>
        </button>

        <button className="farm-menu-card">
          <span>🌱</span>
          <div>
            <h2>Garden</h2>
            <p>Plants & trees</p>
          </div>
        </button>

        <button className="farm-menu-card">
          <span>🐾</span>
          <div>
            <h2>Companions</h2>
            <p>Dogs, cat & more</p>
          </div>
        </button>

        <button className="farm-menu-card">
          <span>💰</span>
          <div>
            <h2>Finances</h2>
            <p>Income & expenses</p>
          </div>
        </button>

        <button className="farm-menu-card">
          <span>📊</span>
          <div>
            <h2>Reports</h2>
            <p>Farm performance</p>
          </div>
        </button>

        <button className="farm-menu-card">
          <span>👨‍👩‍👧‍👦</span>
          <div>
            <h2>Family</h2>
            <p>Updates & suggestions</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Farm