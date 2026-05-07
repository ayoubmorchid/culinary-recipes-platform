import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({ currentPage = 1, totalPages = 1, basePath = '' }) => {
  if (totalPages <= 1) return null

  const buildPageUrl = (page) => {
    const safePage = Math.max(1, Math.min(page, totalPages))
    const separator = basePath.includes('?') ? '&' : '?'
    return `${basePath}${separator}page=${safePage}`
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <nav aria-label="Pagination des recettes">
      <ul className="pagination justify-content-center flex-wrap gap-1">
        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
          <Link className="page-link" to={buildPageUrl(currentPage - 1)}>
            <i className="fas fa-chevron-left me-1"></i>
            Précédent
          </Link>
        </li>

        {getPageNumbers().map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <Link className="page-link" to={buildPageUrl(page)}>
              {page}
            </Link>
          </li>
        ))}

        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
          <Link className="page-link" to={buildPageUrl(currentPage + 1)}>
            Suivant
            <i className="fas fa-chevron-right ms-1"></i>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination