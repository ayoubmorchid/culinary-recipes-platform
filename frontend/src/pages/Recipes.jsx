import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import { recipeService } from '../services/recipeService'

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [pagination, setPagination] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    page: parseInt(searchParams.get('page')) || 1
  })

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      const data = await recipeService.getRecipes(
        filters.page,
        12,
        filters.search,
        filters.categoryId
      )
      setRecipes(data.content || [])
      setPagination({
        currentPage: data.number + 1,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      })
    } catch (error) {
      console.error('Erreur chargement recettes:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  useEffect(() => {
    recipeService.getCategories().then((data) => {
      setCategories(data.content || data)
    }).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters({...filters, page: 1})
    setSearchParams({
      search: filters.search,
      categoryId: filters.categoryId || undefined
    })
  }

  const handlePageChange = (page) => {
    setFilters({...filters, page})
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: page.toString()
    })
  }

  const handleFilterChange = (key, value) => {
    setFilters({...filters, [key]: value, page: 1})
    setSearchParams({
      search: filters.search,
      categoryId: value || undefined
    })
  }

  if (loading) return <Loading />

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-9">
          <div className="page-header">
            <div>
              <h1 className="section-title h2 mb-2">Toutes les Recettes</h1>
              <p className="text-muted mb-0">
                {pagination.totalElements || 0} recettes disponibles
              </p>
            </div>
            <Link to="/recipes/new" className="btn btn-success btn-lg">
              <i className="fas fa-plus me-2"></i>
              Nouvelle recette
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search fa-3x text-muted mb-4"></i>
              <h3 className="text-muted mb-3">Aucune recette trouvée</h3>
              <p className="text-muted">Essayez de modifier vos critères de recherche</p>
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
              <Pagination 
                currentPage={pagination.currentPage} 
                totalPages={pagination.totalPages}
                basePath="/recipes"
              />
            </>
          )}
        </div>

        <div className="col-lg-3">
          <div className="card sticky-top luxury-sticky-panel">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Filtres</h5>
              
              <form onSubmit={handleSearch}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase">Recherche</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Titre de recette..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase">Catégorie</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3">
                  Filtrer
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setFilters({ search: '', categoryId: '', page: 1 })
                    setSearchParams({})
                  }}
                >
                  Réinitialiser
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recipes

