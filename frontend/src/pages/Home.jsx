import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import RecipeCard from '../components/RecipeCard'
import Loading from '../components/Loading'
import { recipeService } from '../services/recipeService'

const Home = () => {
  const [latestRecipes, setLatestRecipes] = useState([])
  const [topRated, setTopRated] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latest = await recipeService.getLatestRecipes(8)
        const topRatedRes = await recipeService.getTopRated(6)
        const categoriesRes = await recipeService.getCategories()

        setLatestRecipes(Array.isArray(latest?.content) ? latest.content : Array.isArray(latest) ? latest : [])
        setTopRated(Array.isArray(topRatedRes?.content) ? topRatedRes.content : Array.isArray(topRatedRes) ? topRatedRes : [])
        setCategories(Array.isArray(categoriesRes?.content) ? categoriesRes.content : Array.isArray(categoriesRes) ? categoriesRes : [])
      } catch (error) {
        console.error('Erreur chargement home:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loading message="Chargement de la page d'accueil..." />

  return (
    <>
      <section className="luxury-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="luxury-badge">Expérience culinaire premium</span>

              <h1 className="luxury-hero-title">
                Découvrez des recettes avec une touche de luxe.
              </h1>

              <p className="luxury-hero-text">
                Explorez, créez et partagez des recettes élégantes dans une plateforme moderne,
                sombre et raffinée.
              </p>

              <div className="d-flex flex-column flex-md-row gap-3">
                <Link to="/recipes" className="btn luxury-main-btn btn-lg px-5">
                  Voir les recettes
                </Link>

                <Link to="/recipes/new" className="btn luxury-secondary-btn btn-lg px-5">
                  Partager ma recette
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="luxury-hero-card">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900"
                  alt="Luxury food"
                />
                <div className="luxury-hero-card-content">
                  <span>Recette du moment</span>
                  <h3>Saveurs modernes</h3>
                  <p>Une sélection raffinée pour inspirer votre cuisine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container luxury-home-content">
        <section className="luxury-section">
          <div className="luxury-section-header">
            <div>
              <span className="luxury-mini-title">Nouveautés</span>
              <h2>Recettes récentes</h2>
            </div>
            <Link to="/recipes" className="luxury-text-link">Tout voir</Link>
          </div>

          {latestRecipes.length === 0 ? (
            <p className="luxury-empty">Aucune recette récente pour le moment.</p>
          ) : (
            <div className="row g-4">
              {latestRecipes.map((recipe) => (
                <div key={recipe.id || recipe.slug} className="col-xl-3 col-lg-4 col-md-6">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="luxury-promo-panel">
          <div>
            <span className="luxury-mini-title">Communauté</span>
            <h2>Vous avez une recette spéciale ?</h2>
            <p>Partagez vos créations avec une communauté passionnée par la cuisine.</p>
          </div>

          <Link to="/recipes/new" className="btn luxury-main-btn">
            Créer une recette
          </Link>
        </section>

        <section className="luxury-section">
          <div className="luxury-section-header">
            <div>
              <span className="luxury-mini-title">Sélection premium</span>
              <h2>Meilleures recettes</h2>
            </div>
          </div>

          {topRated.length === 0 ? (
            <p className="luxury-empty">Aucune recette notée pour le moment.</p>
          ) : (
            <div className="row g-4">
              {topRated.map((recipe) => (
                <div key={recipe.id || recipe.slug} className="col-lg-4 col-md-6">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="luxury-section">
          <div className="luxury-section-header">
            <div>
              <span className="luxury-mini-title">Explorer</span>
              <h2>Catégories populaires</h2>
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="luxury-empty">Aucune catégorie pour le moment.</p>
          ) : (
            <div className="row g-3">
              {categories.slice(0, 8).map((category) => (
                <div key={category.id || category.name} className="col-lg-3 col-md-4 col-sm-6">
                  <Link to={`/recipes?categoryId=${category.id}`} className="luxury-category-card">
                    <div className="luxury-category-icon">🍽️</div>
                    <h5>{category.name}</h5>
                    <p>{category.recipeCount || 0} recettes</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default Home