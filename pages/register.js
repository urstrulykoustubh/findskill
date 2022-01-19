import { useState,useEffect } from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import axios from 'axios'
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts'
import {API} from '../config'
import {isAuth} from '../helpers/auth'
const Register = () => {
	const [state,setState]=useState(
		{
			name:'koustubh',
			email:'koustubh@gmail.com',
			password:'koustubh',
			error:'',
			success:'',
			buttonText:'Register',
			loadedCategories:[],
			categories:[]
		}
	)

useEffect(()=>{
  isAuth() &&  Router.push('/')
},[])

	const handleChange=(name)=>(e)=>{
      setState({...state,[name]:e.target.value,error:'',success:'',buttonText:'Register'})
	}

	const handleSubmit=async e =>{
		e.preventDefault();
		console.table({categories})
		setState({...state,buttonText:'Registering'});
		try{
        const response = await axios.post(`${API}/register`,{
		 name:name,
		 email:email,
		 password:password,
		 categories
	 });
	 	 console.log(response)
		 setState({
			 ...state,
			 name:'',
			 email:'',
			 password:'',
			 buttonText:'Submitted',
			 success:response.data.message
		 })

		}
		catch(err)
		{
           console.log(err)
		   setState({...state,buttonText:'Register',error:err.response.data.error})
		}
	}
	 useEffect(()=>{
     loadCategories()
    },[])
    const loadCategories=async()=>{
        const response=await axios.get(`${API}/categories`)
        setState({...state,loadedCategories:response.data})
    }
	 const handleToggle=c=>()=>{
       const clickedCategory=categories.indexOf(c)
       const all=[...categories]
       
       if(clickedCategory===-1){
           all.push(c);
       }else{
           all.splice(clickedCategory,1);
       }
       setState({...state,categories:all,success:'',error:''})

    }
    const showCategories=()=>{
        return loadedCategories && loadedCategories.map((c,i)=>(
            <li className="list-unstyle" key={c._id}>
                <input type="checkbox" onChange={handleToggle(c._id)} className='mr-2'/>
                <label className='form-check-label'>{c.name}</label>
            </li>
        ))
    }
	const {name,email,password,error,success,buttonText,loadedCategories,categories}=state;
	const registerForm=()=>{
		return <form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input value={name} onChange={handleChange('name')} type="text" className='form-control' placeholder='Type Your name'/>
			</div>
				<div className='form-group'>
				<input  value={email} onChange={handleChange('email')} type="email" className='form-control' placeholder='Type Your email'/>
			</div>
				<div className='form-group'>
				<input  value={password}onChange={handleChange('password')} type="password" className='form-control' placeholder='Type Your password'/>
			</div>
				  <div className="form-group">
                  <label className='text-muted ml-4'>Category</label>
                  <ul style={{maxHeight:'100px',overflowY:'scroll'}}>{showCategories()}</ul>
              </div>
				<div className='form-group'>
				<button className='btn btn-outline-warning'>{buttonText}</button>
			</div>
			
		</form>
	}
	return <Layout>
	<div className='col-md-6 offset md-3'>
	<h1>Register</h1>
	<br />
	{success && showSuccessMessage(success)}
	{error && showErrorMessage(error)}
	{registerForm()}
	</div>
	</Layout>
}

export default Register;
