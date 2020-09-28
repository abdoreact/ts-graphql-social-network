import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { likeMutation, currentUserQuery } from '../App';
const postQuery = gql`
query ($id:Float!){
  getPost(id:$id){
    text
    user{
      username
      id
    }
    likes
    id
  }
}
`
const Post: React.FC = () => {
  const { id } = useParams();
  const { data, loading, refetch } = useQuery(postQuery, {
    variables: {
      id: Number(id)
    }
  })
  const { data: currentUser, loading: userLoading } = useQuery(currentUserQuery, {
    variables: {
      jwt: localStorage.getItem("jwt")
    },
    errorPolicy: 'none'
  })
  const [like] = useMutation(likeMutation)
  if (loading || userLoading) return <div>Loading...</div>;
  return <div>
    {currentUser ? <Link to="/">Home</Link> : <div>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </div>}
    <div>
      <Link to={`/user/${data.getPost.user.id}`}><div>{data.getPost.user.username}</div></Link>
      <div>{data.getPost.text}</div>
      <div>{data.getPost.likes}</div>
      <button onClick={() => {
        like({ variables: { post: data.getPost.id, jwt: localStorage.getItem("jwt") } }).then(() => refetch())
      }}>Like</button>
    </div>
  </div>
}
export default Post;