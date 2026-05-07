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

  if (loading) {
    return <Loading message="Chargement de la page d'accueil..." />
  }

  return (
    <>
      <section
        className="py-5 text-white"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
      >
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">
            Bienvenue chez <span className="text-light">Culinary Recipes</span>
          </h1>

          <p className="lead mb-4">
            Découvrez des milliers de recettes délicieuses partagées par notre communauté.
          </p>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Link to="/recipes" className="btn btn-light btn-lg px-5">
              Voir toutes les recettes
            </Link>

            <Link to="/recipes/new" className="btn btn-outline-light btn-lg px-5">
              Partager ma recette
            </Link>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <section className="mb-5">
          <h2 className="h2 text-center mb-5">🍽️ Recettes Récentes</h2>

          {latestRecipes.length === 0 ? (
            <p className="text-center text-muted">Aucune recette récente pour le moment.</p>
          ) : (
            <div className="row g-4">
              {latestRecipes.map((recipe) => (
                <div key={recipe.id || recipe.slug} className="col-lg-3 col-md-6">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/recipes" className="btn btn-success btn-lg">
              Voir toutes les recettes récentes
            </Link>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h2 text-center mb-5">⭐ Meilleures Recettes</h2>

          {topRated.length === 0 ? (
            <p className="text-center text-muted">Aucune recette notée pour le moment.</p>
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

        <section>
          <h2 className="h2 text-center mb-5">📂 Catégories Populaires</h2>

          {categories.length === 0 ? (
            <p className="text-center text-muted">Aucune catégorie pour le moment.</p>
          ) : (
            <div className="row g-3">
              {categories.slice(0, 8).map((category) => (
                <div key={category.id || category.name} className="col-md-3 col-sm-6">
                  <Link to={`/recipes?categoryId=${category.id}`} className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center py-4">
                        <div
                          className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <span className="fs-2">🍗</span>
                        </div>

                        <h5 className="card-title fw-semibold">{category.name}</h5>
                        <p className="text-muted small">{category.recipeCount || 0} recettes</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default Home