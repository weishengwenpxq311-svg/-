export default function TopBar() {
  const onJump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="topbar">
      <div className="brand">
        Xiu Qi <em style={{ fontStyle: 'italic' }}>·</em> 修琪
      </div>
      <div className="menu">
        <a href="#page-home" onClick={(e) => onJump(e, 'page-home')}>
          Home
        </a>
        <a href="#page-about" onClick={(e) => onJump(e, 'page-about')}>
          About
        </a>
        <a href="#page-works" onClick={(e) => onJump(e, 'page-works')}>
          Works
        </a>
      </div>
    </nav>
  );
}
