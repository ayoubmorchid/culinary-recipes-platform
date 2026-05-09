import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Loading from '../components/Loading'

const PublicProfile = () => {
  const { username } = useParams()
  return (
    <div className="container py-5">
      <Loading message={`Chargement du profil ${username}...`} />
      {/* Full implementation coming */}
    </div>
  )
}

export default PublicProfile

