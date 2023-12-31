/* eslint-disable react/prop-types */
import { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Proptype from 'prop-types'
import './Login.css'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userData'
import { setDoctorData } from '../redux/doctorData'
import { setAdminData } from '../redux/adminData'
import useAuth from '../context/hooks/useAuth'
import { validateEmail } from './validator'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config"
Login.Proptype = {
    value: Proptype.string
}

function Login({ value }) {
    const provider = new GoogleAuthProvider()
    const { setUser, setDoctor, setAdmin } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const dispatch = useDispatch()
    const history = useNavigate()

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        const Doctoken = localStorage.getItem("doctorToken");
        const admintoken = localStorage.getItem("adminToken");
     
       if(value==='doctor' && Doctoken) {
        console.log(1222,Doctoken);
        history('/doctor/')
       }else
        if(value==='admin' && admintoken){
            history('/admin')
        }else{
               
       if (userToken && !value==='doctor' && !value==='admin') {
        console.log(13333,userToken);
            history('/')
       }
        }
    },[value]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setErrorMsg('Please fill all the blanks')
            return
        }
        if (!validateEmail(email)) {
            setErrorMsg('Invalid Email id,Please enter valid email id.')
            return;
        }

        value === 'doctor' ?
            await axios.post(import.meta.env.VITE_BASE_URL + 'doctor/login', {
                email,
                password
            }).then((res) => {
                if (res.data === 'unauthorized') {
                    setErrorMsg('invalid email or password')
                } else if (res.data === 'unverified') {
                    setErrorMsg('Email not verified.Please check your mail')
                } else if (res.data === 'blocked') {
                    setErrorMsg('This accout has been blocked.Please contact admin')
                } else if (res.data == 'notApproved') {
                    setErrorMsg('This account is not yet approved by the admins.PLease wait till we notify you by mail')
                } else {
                    localStorage.setItem("doctorToken", res.data.token)
                    dispatch(setDoctorData(res.data.doctorData))
                    setDoctor(true)
                    history('/doctor/')
                }
            })
            : value === 'admin' ?
                await axios.post(import.meta.env.VITE_BASE_URL + 'admin/login', {
                    email,
                    password
                }).then((res) => {
                    if (res.data === 'unauthorized') {
                        setErrorMsg('invalid email or password')
                    }
                    else if (res.data === 'blocked') {
                        setErrorMsg('Your access has been blocked...!')
                    } else {
                        localStorage.setItem("adminToken", res.data.token)
                        dispatch(setAdminData(res.data.adminData))
                        setAdmin(true)
                        history('/admin/')
                    }
                })
                :
                await axios.post(import.meta.env.VITE_BASE_URL + 'login', {
                    email,
                    password
                }).then((res) => {
                    if (res.data === 'unauthorized') {
                        setErrorMsg('invalid email or password...!')
                    } else if (res.data === 'unverified') {
                        setErrorMsg("Mail not verified please check your mail...!")
                    } else if (res.data === 'blocked') {
                        setErrorMsg('This account has been blocked.Please contact the support team...!')
                    }
                    else {
                        console.log(res.data);
                        localStorage.setItem("userToken", res.data.token)
                        dispatch(setUserData(res.data.userData))
                        setUser(true)
                        history('/')
                    }
                })
    }


    
const submitSignInWithGoogle = async (displayName, email) => {
    try {
      const value = { displayName, email };
     
      const response = await axios.post(import.meta.env.VITE_BASE_URL + 'google/signin', value);
      console.log(response);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', response.data.token);
     console.log(localStorage.getItem("userToken"));
      dispatch(setUserData(response.data.userData))
      
      setUser(true)
      history('/')

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error
        if (axiosError.response) {
            setErrorMsg(axiosError.response.data.error);
        } else {
            setErrorMsg('Network Error occurred.');
        }
      }
    }
  };



  const signInWithGoogle = () => {
       
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email } = result.user;
  
        if (displayName && email) {
            submitSignInWithGoogle(displayName, email);
        }
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };


    return (
        <section className="logForm m-5 ">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 text-center  col-lg-6 col-xl-5 ">
                        <img src="/derek-finch-bD1bK7IUvd8-unsplash.jpg"
                            className="img-fluid logimg mb-3 " alt="Sample image" />
                    </div>
                    
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 border p-4 shadow-lg text-blue-500">
                    { value!=='admin' && value!=='doctor' && <button className="form-outline mb-4" onClick={signInWithGoogle}>
                        <img src="/googlelogo.png" alt="" style={{ width: '20px' }} /> Signin with Google
                    </button>}
                        <form>
                            {errorMsg ?
                                <div className="alert alert-danger" role="alert">
                                    {errorMsg}
                                </div> : ''
                            }
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form3Example3">Email address</label>
                                <input type="email" id="form3Example3" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Email..." />
                            </div>

                            <div className="form-outline mb-3">
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                                <input type="password" id="form3Example4" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Password..." />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">

                                {value != 'admin' && <Link to={value == "doctor" ? '/doctor/forgotPassword' : '/forgotPassword'} className="text-body">Forgot password?</Link>}
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button type="button" className="btn btn-success btn-lg"
                                    style={{ "paddingLeft": "2.5rem", "paddingRight": "2.5rem" }} onClick={handleSubmit}>Login</button>
                                {value != 'admin' && <p className="small fw-bold mt-2 pt-1 mb-0"> Create an account? <span className='text-primary'>
                                    {
                                        value === 'doctor' ? <Link to={'/doctor/signup'}>Register</Link>
                                            : <Link to={'/signup'}>Register</Link>
                                    }
                                </span> </p>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login