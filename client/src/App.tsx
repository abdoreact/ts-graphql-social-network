import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
export const currentUserQuery = gql`
  query($jwt: String) {
    currentUser(jwt: $jwt) {
      username
      id
    }
  }
`;

const postsQuery = gql`
  query {
    posts {
      id
      user {
        username
        id
      }
      text
      likes
    }
  }
`;

export const deletePostMutation = gql`
mutation ($jwt:String!, $post:Float!){
  deletePost(jwt:$jwt, post:$post)
}
`

const postMutation = gql`
mutation ($jwt:String!, $body:String!){
  post(body:$body, jwt:$jwt){
    id
  }
}
`;

export const likeMutation = gql`
mutation($jwt:String!, $post:Float!){
  like(jwt:$jwt, post:$post)
}
`

const App: React.FC = () => {
  const [post] = useMutation(postMutation);
  const { data, loading, error } = useQuery(currentUserQuery, {
    variables: {
      jwt: localStorage.getItem("jwt"),
    },
  });
  const [deletePost] = useMutation(deletePostMutation);
  const [like] = useMutation(likeMutation)
  const [postBody, setPostBody] = useState("");
  const Post = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post({ variables: { jwt: localStorage.getItem("jwt"), body: postBody } }).then(refetch);
  };
  const { data: posts, refetch } = useQuery(postsQuery);
  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    );
  return (
    <div>
      <div style={{ marginBottom: 20 }}>{data.currentUser.username}</div>
      <form onSubmit={Post}>
        <input
          type="text"
          required
          onChange={(e) => setPostBody(e.target.value)}
        />
        <button>Post</button>
      </form>
      {posts &&
        posts.posts.map(
          (post: { id: number; text: string; user: { username: string, id:number }, likes: number; }) => (
            <div key={post.id} style={{ marginBottom: 10 }}>
              <div>{post.text}</div>
              <Link to={`/user/${post.user.id}`}><div>{post.user.username}</div></Link>
              <div>{post.likes}</div>
              <button onClick={() => {
                like({ variables: { post: post.id, jwt: localStorage.getItem("jwt") } }).then(refetch)
              }}>Like</button>
              <div>{post.user.id === data.currentUser.id && <button onClick={() => {
                deletePost({variables:{jwt:localStorage.getItem("jwt"), post:post.id}}).then(refetch)
              }}>Delete</button>}</div>
              <Link to={`/post/${post.id}`}>Go to post</Link>
            </div>
          )
        )}
    </div>
  );
};

export default App;
