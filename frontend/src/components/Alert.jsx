import React from 'react'

const Alert = ({ alert }) => {
  if (!alert.show) return null

  const getVariantClass = (type) => {
    const variants = {
      success: 'alert-success',
      danger: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info'
    }
    return variants[type] || 'alert-primary'
  }

  return (
    <div className={`alert ${getVariantClass(alert.type)} alert-dismissible fade show position-fixed luxury-alert`} role="alert">
      <i className={`fas me-2 fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'danger' ? 'exclamation-triangle' : 'info-circle'}`}></i>
      {alert.message}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    </div>
  )
}

export default Alert

