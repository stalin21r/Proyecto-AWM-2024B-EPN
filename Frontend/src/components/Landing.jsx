import { useState, useEffect, useRef } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import EmailIcon from '@mui/icons-material/Email'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import logo from '../assets/logo.png'
import { LandingInicio } from './LandingInicio'
import { LandingCasillero } from './LandingCasillero'
import '../landing.css'
import { LandingProducto } from './LandingProducto'
export function Landing() {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false)
  const coverRef = useRef(null) // Referencia al elemento de la imagen

  useEffect(() => {
    const handleScroll = () => {
      if (coverRef.current) {
        const imageHeight = coverRef.current.offsetHeight // Altura de la imagen
        if (window.scrollY > imageHeight) {
          setIsNavbarFixed(true)
        } else {
          setIsNavbarFixed(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="cover" ref={coverRef}>
          {/* Usamos ref para referenciar la imagen */}
          <div className="landing-top-container">
            <div>
              <img alt="lobo" src={logo} />
            </div>
            <div>
              <h1>Asociación de Estudiantes de Ingeniería Electrónica</h1>
            </div>
          </div>
        </div>
        <div className={`landing-navbar ${isNavbarFixed ? 'fixed' : ''}`}>
          <nav className="navbar">
            <ul>
              <li>
                <NavLink to={'/'}>Inicio</NavLink>
              </li>
              <li>
                <NavLink to={'/casilleros'}>Casilleros</NavLink>
              </li>
              <li>
                <NavLink to={'/tienda'}>Tienda</NavLink>
              </li>
              <li>
                <NavLink
                  to={'https://www.facebook.com/epn.aeie'}
                  target="_blank"
                >
                  <FacebookIcon />
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'https://www.instagram.com/aeie_epn'}
                  target="_blank"
                >
                  <InstagramIcon />
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Aquí puedes agregar más componentes */}
        <Routes>
          <Route path="/" element={<Navigate to="/aeie" />} />
          <Route path="/aeie" element={<LandingInicio />} />
          <Route path="/casilleros" element={<LandingCasillero />} />
          <Route path="/tienda" element={<LandingProducto />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="landing-footer-content">
          <div className="landing-footer-rights">
            <p>
              &copy; 2025-2026 <strong>AEIE.</strong>
            </p>
            <p style={{ gap: '10px', display: 'flex' }}>
              <strong>Designed by</strong>
              <NavLink
                to={'https://github.com/stalin21r'}
                style={{ color: '#3f69ff' }}
              >
                Stalin Garcia
              </NavLink>
              <p style={{ color: '#3f69ff' }}>, Aldair Flor</p>
            </p>
          </div>
          <div className="landing-footer-contacts">
            <h5>Contactos</h5>
            <section>
              <p>
                <EmailIcon /> <strong>asociacionelectronica@epn.edu.ec</strong>
              </p>
              <p>
                <ContactPhoneIcon /> <strong>+593 987822975</strong>
              </p>
              <p>
                <ContactPhoneIcon /> <strong>+593 987822975</strong>
              </p>
              <p>
                <LocationOnIcon />{' '}
                <NavLink to={'https://maps.app.goo.gl/1Ri2EGQ4e8HttZKB9'}>
                  <strong>
                    Av. Ladrón de Guevara E11-253 170525 Quito, Ecuador
                  </strong>
                </NavLink>
              </p>
            </section>
          </div>
          <div className="landing-footer-social">
            <h5>Síguenos</h5>
            <section>
              <NavLink to={'https://www.facebook.com/epn.aeie'} target="_blank">
                <FacebookIcon sx={{ fontSize: '50px' }} />
              </NavLink>
              <NavLink
                to={'https://www.instagram.com/aeie_epn'}
                target="_blank"
              >
                <InstagramIcon sx={{ fontSize: '50px' }} />
              </NavLink>
            </section>
          </div>
        </div>
      </footer>
    </div>
  )
}
