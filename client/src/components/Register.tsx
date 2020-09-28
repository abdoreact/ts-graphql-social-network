import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

const registerMutation = gql`
  mutation($email: String!, $username: String!, $password: String!) {
    register(
      input: { email: $email, password: $password, username: $username }
    ) {
      id
    }
  }
`;

const Register: React.FC = () => {
  const {push} = useHistory()
  const [register] = useMutation(registerMutation, {
    errorPolicy: "all",
  });
  const [form, setForm] = useState({
    username: "",
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
    register({ variables: form }).then(({ errors, data }) => {
      errors && setError(Object.values(errors[0])[0])
      console.log(data)
      if (data) {
        localStorage.setItem('jwt', data.login.id)
        push('/')
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" onChange={handleChange} />
        <input type="email" name="email" onChange={handleChange} />
        <input type="password" name="password" onChange={handleChange} />
        <div>{error}</div>
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
