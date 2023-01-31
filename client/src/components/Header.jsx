import logo from "./assets/logo.png";
export default function Header(params) {
  return (
    <nav className="navbar bg-light mb-4 p-0">
      <div className="container">
        <a href="/" className="navbar-brand">
          <div className="d-flex">
            <img src={logo} className="mr-2" alt="" />
            <div>Progect Managment</div>
          </div>
        </a>
      </div>
    </nav>
  );
}
