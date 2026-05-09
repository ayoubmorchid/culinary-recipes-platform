import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white py-5 mt-auto shadow-sm">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-success mb-3">
              <i className="fas fa-utensils me-2"></i>
              Culinary Recipes
            </h5>
            <p className="text-muted small">
              Partagez vos meilleures recettes avec la communauté. 
              Des milliers de recettes délicieuses vous attendent !
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-dark mb-3">Liens rapides</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none small">Accueil</a></li>
              <li><a href="/recipes" className="text-muted text-decoration-none small">Recettes</a></li>
              <li><a href="/categories" className="text-muted text-decoration-none small">Catégories</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-dark mb-3">Suivez-nous</h6>
            <div>
              <a href="#" className="text-muted me-3"><i className="fab fa-facebook-f fs-5"></i></a>
              <a href="#" className="text-muted me-3"><i className="fab fa-instagram fs-5"></i></a>
              <a href="#" className="text-muted me-3"><i className="fab fa-twitter fs-5"></i></a>
              <a href="#" className="text-muted"><i className="fab fa-youtube fs-5"></i></a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted small mb-0">
              © 2024 Culinary Recipes. Tous droits réservés.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="/privacy" className="text-muted text-decoration-none small me-3">Confidentialité</a>
            <a href="/terms" className="text-muted text-decoration-none small">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

