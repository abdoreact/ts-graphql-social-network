import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(
      input: { email: $email, password: $password }
    ) {
      id
      error
    }
  }
`;

const Login: React.FC = () => {
  const {push} = useHistory()
  const [login] = useMutation(loginMutation, {
    errorPolicy: "all",
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    login({ variables: form }).then(({ errors, data }) => {
      errors && setError(Object.values(errors[0])[0])
      if (data) {
        if (data.login.error) {
          setError(data.login.error)
          return 
        }
        localStorage.setItem('jwt', data.login.id)
        push('/')
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" onChange={handleChange} />
        <input type="password" name="password" onChange={handleChange} />
        <div>{error}</div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
