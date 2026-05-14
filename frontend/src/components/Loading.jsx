import React from 'react'

const Loading = ({ message = 'Chargement...' }) => {
  return (
    <div className="loading d-flex flex-column justify-content-center align-items-center min-vh-50">
      <div className="spinner-border text-success luxury-spinner mb-3" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="text-muted mb-0">{message}</p>
    </div>
  )
}

export default Loading

