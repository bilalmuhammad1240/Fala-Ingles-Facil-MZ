import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">FIF</span>
          Fala Inglês Fácil MZ
        </Link>
        <div className="nav-links">
          <Link to="/">Início</Link>
          <Link to="/modulo-1">Módulos</Link>
        </div>
      </div>
    </div>
  );
}
