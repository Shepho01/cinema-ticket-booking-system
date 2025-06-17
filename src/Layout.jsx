import Navbar from "./Components/Navbar/Navbar.jsx";
import { Outlet } from 'react-router-dom';
import Footer from "./Footer.jsx";
import './Layout.css'; // Assuming you have a CSS file for styling


const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
