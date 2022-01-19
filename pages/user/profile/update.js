import { useState,useEffect } from 'react'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import axios from 'axios'
import {showSuccessMessage,showErrorMessage} from '../../../helpers/alerts'
import {API} from '../../../config'
import {isAuth,updateUser} from '../../../helpers/auth'
import withUser from '../../withUser'

const Profile = ({user,token}) => {
	const [state,setState]=useState(
		{
			name:user.name,
			email:user.email,
			password:'',
			error:'',
			success:'',
			buttonText:'Update',
			loadedCategories:[],
			categories:user.categories
		}
	)


	const handleChange=(name)=>(e)=>{
      setState({...state,[name]:e.target.value,error:'',success:'',buttonText:'Update'})
	}

	const handleSubmit=async e =>{
		e.preventDefault();
		console.table({categories})
		setState({...state,buttonText:'updating'});
		try{
        const response = await axios.put(`${API}/user`,{
		 name,email,password,categories
	 },{headers:{Authorization:`Bearer ${token}`}});
	    updateUser(response.data,()=>{
          setState({
			 ...state,
			 buttonText:'Updated',
			 success:'Profile Updated Successfully'
		 })

		})
	 	 console.log(response)
		
		}
		catch(err)
		{
           console.log(err)
		   setState({...state,buttonText:'Update',error:err.response.data.error})
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
                <input type="checkbox" onChange={handleToggle(c._id)} checked={categories.includes(c._id)} className='mr-2'/>
                <label className='form-check-label'>{c.name}</label>
            </li>
        ))
    }
	const {name,email,password,error,success,buttonText,loadedCategories,categories}=state;
	const updateForm=()=>{
		return <form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input value={name} onChange={handleChange('name')} type="text" className='form-control' placeholder='Type Your name' required/>
			</div>
				<div className='form-group'>
				<input  value={email} onChange={handleChange('email')} type="email" className='form-control' placeholder='Type Your email' disabled/>
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
	<h1>Update Your Profile</h1>
	<br />
	{success && showSuccessMessage(success)}
	{error && showErrorMessage(error)}
	{updateForm()}
	</div>
	</Layout>
}

export default withUser(Profile);
