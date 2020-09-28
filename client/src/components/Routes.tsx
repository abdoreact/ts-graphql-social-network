import React from 'react';
import { Route } from 'react-router-dom';
import App, { currentUserQuery } from '../App';
import { useQuery } from '@apollo/client';
import Register from './Register';
import Login from './Login';
import Post from './Post';
import User from './User';
const Routes: React.FC = () => { 

  const { error, loading } = useQuery(currentUserQuery, {
    variables: {
      jwt:localStorage.getItem('jwt')
    }
  })

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Route exact path='/' component={App} />
      <Route path='/post/:id' component={Post} />
      <Route path='/user/:id' component={User} />
    {error && (
      <>
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
      </>
    )}
    </>
  )
}

export default Routes;