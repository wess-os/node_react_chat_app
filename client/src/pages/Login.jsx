import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Logo from '../assets/icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { loginRoute } from '../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: '',
        password: '',
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()) {
            const { username, password } = values;

            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });

            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
            }
        }
    }

    const handleValidation = () => {
        const { password, username } = values;
        if (password === "") {
            toast.error('A senha não pode estar vazia', toastOptions);
            return false;
        } else if (username.length === "") {
            toast.error('O nome de usuário não pode estar vazio', toastOptions);
            return false;
        }
        return true;
    } 

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className='brand'>
                        <img src={Logo} alt="Logo" />
                        <h1>Chat</h1>
                    </div>
                    <input
                        type='text'
                        placeholder='Usuário'
                        name='username'
                        onChange={(e) => handleChange(e)}
                        min="3"
                    />
                    <input
                        type='password'
                        placeholder='Senha'
                        name='password'
                        onChange={(e) => handleChange(e)}
                    />
                    <button 
                        type='submit'
                    >
                        Entrar
                    </button>
                    <span>Ainda não possui uma conta? <Link to='/register'>Cadastrar</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #333;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1 {
            color: #ff3333;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #f3f3f3;
            border-radius: 0.4rem;
            color: #f3f3f3;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #ff3333;
                outline: none;
            }
        }
        button {
            background-color: #ff3333;
            color: #f3f3f3;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.2s ease-in-out;
            &:hover {
                background-color: #a51e1e;
            }
        }
        span {
            color: #f3f3f3;
            text-transform: uppercase;
            a {
                color: #ff3333;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Login;