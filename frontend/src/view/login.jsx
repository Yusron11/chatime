import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoute';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    // useEffect(() => {
    //   if(localStorage.getItem('chatime-user')) {
    //     navigate('/')
    //   }
    // }, []);

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (handleValidation()) {
          const {username, password} = values;
          const {data} = await axios.post(loginRoute, {
              username,
              password,
          });
          if (data.status === false) {
              alert(data.msg);
          }
          if (data.status === true) {
              localStorage.setItem('chatime-user', JSON.stringify(data.user));
              navigate("/");
          }
      }
    };
    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    };
    const handleValidation = () => {
        const {username, password} = values;
        if (password.length === "") {
            alert("username and password is required");
            return false;
        } else if (username.length === "") {
            alert("username and password is required");
            return false;
        }
        return true;
    };

    return (
        <>
            <FormContainer>

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src='' alt=''/>
                        <h1>chatime</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        onChange={(e) => handleChange(e)}
                        min = "4" 
                        required/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        onChange={(e) => handleChange(e)} 
                        required/>
                    <button type="submit">Login</button>
                    <span>don't have an account ? <Link to = "/register">Register</Link></span>
                </form>

            </FormContainer>
        </>
    );

};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;