import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className="luxury-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Culinary Recipes</h5>
              <p>
                Plateforme moderne pour partager et découvrir les meilleures recettes.
              </p>
            </div>

            <div className="col-md-4">
              <h5>Navigation</h5>
              <ul>
                <li>
                  <Link to="/">Accueil</Link>
                </li>
                <li>
                  <Link to="/recipes">Recettes</Link>
                </li>
                <li>
                  <Link to="/search">Recherche</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h5>Contact</h5>
              <p>
                <i className="fas fa-envelope me-2"></i>
                contact@culinaryrecipes.com
              </p>
              <p>
                <i className="fas fa-phone me-2"></i>
                +212 600000000
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Culinary Recipes — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      <a href="#" className="back-to-top">
        <i className="fas fa-arrow-up"></i>
      </a>
    </>
  )
}

export default Footer