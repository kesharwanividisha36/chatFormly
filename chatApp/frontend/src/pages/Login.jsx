import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice.js'

function Login() {
 let navigate=useNavigate()
let [show,setShow]=useState(false)

let [email,setEmail]=useState("")
let [password,setPassword]=useState("")
let [loading,setLoading]=useState(false)
let [err,setErr]=useState("")
let dispatch=useDispatch()

const handleLogin=async (e)=>{
  e.preventDefault()
  setLoading(true)
  try{
let result=await axios.post(`${serverUrl}/api/auth/login`,{
email,password
},{withCredentials:true})
dispatch(setUserData(result.data))
dispatch(setSelectedUser(null))
navigate("/")
setEmail("")
setPassword("")
setLoading(false)
setErr("")
  }catch(error){
    console.log(error)
    setLoading(false)
    setErr(error.response.data.message)
  }
}

  return (
           
     

    
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
     <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg
     shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
      <div className='w-full h-[200px] bg-[#39fc12] rounded-b-[30%] 
      shadow-gray-400 shadow-lg items-center justify-center flex'>
        <h1 className='text-gray-700 font-bold text-[30px]'>Login to <span className='text-white'>ChatFomrly</span></h1>

      </div>
      <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
    
    <input type="email" placeholder='email' className='w-[90%] h-[50px]
    outline-none border-2 border-[#39fc12] px-[20px] py-[10px] bg-[white]
    rounded-lg shadow-gray-200 shadow-lg text-[19px] text-gray-700' onChange={(e)=>setEmail(e.target.value)} value={email}/>

    <div className='w-[90%] h-[50px] border-2 border-[#39fc12] overflow-hidden
    rounded-lg shadow-gray-200 shadow-lg relative'>
        <input type={`${show?"text":"password"}`} placeholder='password' className='w-full h-full
    outline-none px-[20px] py-[10px] bg-[white] text-[19px] text-gray-700
    ' onChange={(e)=>setPassword(e.target.value)} value={password}/>
    <span className='absolute top-[10px] right-[20px] text-[19px] text-[#39fc12] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show?"hidden":"show"}`}</span>
    </div>
    
    {err && <p className='text-red-500'>{"*"+err}</p>}
    <button className='px-[20px] py-[10px] bg-[#39fc12] rounded-2xl
    shadow-gray-400 shadow-lg text-[20px] w-[150px] font-bold mt-[20px] text-gray-700
    hover:shadow-inner' disabled={loading}>
      {loading?"Loading..":"Login"}
    </button>
    <p className='cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new Account ?<span className='text-[#39fc12] font-bold'>SignUp</span></p>
     </form>
     </div>
     
    </div>
   
  )
}

export default Login