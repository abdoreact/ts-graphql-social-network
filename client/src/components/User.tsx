import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { currentUserQuery } from '../App';
const userQuery = gql`
query ($id:Float!){
  user(id:$id){
    id
    posts{
      text
      id
    }
    username
  }
}
`
const User: React.FC = () => {
  const { id } = useParams();
  const { data:currentUser, loading } = useQuery(currentUserQuery, {
    variables: {
      jwt:localStorage.getItem("jwt")
    },
    errorPolicy:'none'
  })
  const { data:user, loading:userLoading } = useQuery(userQuery, {
    variables: {
      id:Number(id)
    }
  })
  if (loading || userLoading) return <div>Loading...</div>
  return <div>
    {currentUser ? <Link to="/">Home</Link> : <div>
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    </div>}
    <div>{user.user.username}</div>
    <br/>
    {user.user.posts.map((post: { text: string, id: number }) => <div key={post.id}>
      <Link to={`/post/${post.id}`}>{post.text}</Link>
    </div>)}
    </div>
    }
export default User;