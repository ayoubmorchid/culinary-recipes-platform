import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="luxury-footer mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <h4 className="luxury-footer-logo">✦ Culinary Recipes</h4>
            <p className="luxury-muted">
              Une expérience premium pour découvrir, créer et partager des recettes modernes.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="luxury-footer-title">Navigation</h6>
            <ul className="list-unstyled luxury-footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/recipes">Recettes</Link></li>
              <li><Link to="/search">Recherche</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="luxury-footer-title">Suivez-nous</h6>
            <div className="luxury-socials">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </div>

        <hr className="luxury-line" />

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
          <p className="luxury-muted small mb-0">© 2024 Culinary Recipes. Tous droits réservés.</p>
          <div>
            <a href="/privacy" className="luxury-mini-link me-3">Confidentialité</a>
            <a href="/terms" className="luxury-mini-link">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer