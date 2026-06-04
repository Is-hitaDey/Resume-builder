import React from 'react'
import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router';

const PublicRoute = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (<main><h1>Loading.....</h1></main>)
    }

    if (user) {
        return <Navigate to='/' replace />
    }

    return children
}

export default PublicRoute