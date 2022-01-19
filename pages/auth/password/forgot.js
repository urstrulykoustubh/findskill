import {useState} from 'react'
import axios from 'axios'
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts'
import {API} from '../../../config'
import Layout from '../../../components/Layout'
import Router from 'next/router'


const ForgotPassword=()=>{
  const [state,setState]=useState({
      email:'',
      buttonText:'Forgot Password',
      success:'',
      error:''
  })

  const {email,buttonText,success,error}=state;

  const handleChange=e=>{
      setState({...state,email:e.target.value});
  }
  const handleSubmit=async e=>{
    e.preventDefault();
    try{
        const response=await axios.put(`${API}/forgot-password`,{email})
        console.log(response);
        setState({
            ...state,email:'',buttonText:'Done',success:response.data.message
        })
    }catch(error){
        console.log(error);
         setState({
             ...state,buttonText:'Forgot Password',error:error.response.data.error
         })
    }
    
  }
  const passwordForgotForm=()=>(
      <form onSubmit={handleSubmit}>
          <div className='form-group'>
              <input type="email" className='form-control' onChange={handleChange} value={email} placeholder='Type Your email' required/>
          </div>
         <div>
             <button className='btn btn-outline-warning'>{buttonText}</button>
         </div>
      </form>
  )
  return <Layout>
      <div className='row'>
          <div className='col-md-6 offset-md-'>
         <h1>Forgot Password</h1>
         <br />
         {success && showSuccessMessage(success)}
         {error && showErrorMessage(error)}
         {passwordForgotForm()}
      </div>
      </div>
  </Layout>
}


export default ForgotPassword