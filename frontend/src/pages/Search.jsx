import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { useLocation, Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import { recipeService } from '../services/recipeService'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [recipes, setRecipes] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadResults()
  }, [query, page])

  const loadResults = async () => {
    if (!query) {
      setRecipes([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await recipeService.getRecipes(page, 12, query)
      setRecipes(data.content || [])
      setPagination({
        currentPage: data.number + 1,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      })
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  if (loading) return <Loading message={`Recherche de "${query}"...`} />

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <i className="fas fa-search me-3 text-success"></i>
          Recherche: "{query}"
        </h1>
        <p className="lead text-muted">
          {pagination.totalElements || 0} résultat{pagination.totalElements !== 1 ? 's' : ''} trouvé{pagination.totalElements !== 1 ? 's' : ''}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">Aucun résultat</h3>
          <p className="text-muted mb-4">Aucune recette ne correspond à votre recherche "{query}"</p>
          <Link to="/recipes" className="btn btn-success">
            Explorer toutes les recettes
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="col-xl-4 col-lg-6">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath={`/search?q=${encodeURIComponent(query)}`}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Search
