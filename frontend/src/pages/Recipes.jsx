import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

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

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    loadRecipes()
  }, [search, categoryId, page])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadRecipes = async () => {
    try {
      setLoading(true)

      const data = await recipeService.getRecipes(
        page,
        12,
        search,
        categoryId
      )

      const list = Array.isArray(data) ? data : data.content || []

      setRecipes(list)

      setPagination({
        currentPage: data.number + 1 || page,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || list.length
      })
    } catch (error) {
      console.error('Erreur chargement recettes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await recipeService.getCategories()

      setCategories(
        Array.isArray(data)
          ? data
          : data.content || []
      )
    } catch (error) {
      console.error('Erreur catégories:', error)
      setCategories([])
    }
  }

  const updateFilters = (nextValues) => {
    const params = {}

    const nextSearch =
      nextValues.search !== undefined
        ? nextValues.search
        : search

    const nextCategoryId =
      nextValues.categoryId !== undefined
        ? nextValues.categoryId
        : categoryId

    const nextPage =
      nextValues.page !== undefined
        ? nextValues.page
        : 1

    if (nextSearch) params.search = nextSearch
    if (nextCategoryId) params.categoryId = nextCategoryId
    if (nextPage > 1) params.page = String(nextPage)

    setSearchParams(params)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    updateFilters({
      search: searchInput.trim(),
      page: 1
    })
  }

  const handleCategoryChange = (e) => {
    updateFilters({
      categoryId: e.target.value,
      page: 1
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setSearchParams({})
  }

  const paginationBasePath = `/recipes${
    search || categoryId
      ? `?${new URLSearchParams({
          ...(search ? { search } : {}),
          ...(categoryId ? { categoryId } : {})
        }).toString()}`
      : ''
  }`

  if (loading) {
    return <Loading message="Chargement des recettes..." />
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
            <div>
              <h1 className="section-title h2 mb-2">
                Toutes les Recettes
              </h1>

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
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-4"></i>
              <h3 className="text-muted mb-3">
                Aucune recette trouvée
              </h3>
              <p className="text-muted">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-5">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id || recipe.slug}
                    className="col-xl-4 col-lg-6"
                  >
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath={paginationBasePath}
              />
            </>
          )}
        </div>

        <div className="col-lg-3">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Filtres</h5>

              <form onSubmit={handleSearchSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase">
                    Recherche
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Titre de recette..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase">
                    Catégorie
                  </label>

                  <select
                    className="form-select form-select-sm"
                    value={categoryId}
                    onChange={handleCategoryChange}
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
                  onClick={handleReset}
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