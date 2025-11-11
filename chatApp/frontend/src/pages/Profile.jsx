import React from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice.js';

function Profile() {
    let {userData}=useSelector(state=>state.user)
    let dispatch=useDispatch()
    let navigate=useNavigate()
    let [name,setName]=useState(userData.name || "")
    let [frontendImage,setFrontendImage]=useState(userData.image || dp)
    let [backendImage,setBackendImage]=useState(null)
    let image=useRef()
    let [saving,setSaving]=useState(false)

    const handleImage=(e)=>{
      let file=e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
    const handleProfile=async(e)=>{
     e.preventDefault()
     setSaving(true)
     try {
      let formData=new FormData()
      formData.append("name",name)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result=await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
      setSaving(false)
      dispatch(setUserData(result.data))
      navigate("/")
     } catch (error) {
      console.log(error)
      setSaving(false)
     }
    }
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center
    items-center gap-[20px] ' >
        <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={()=>navigate("/")}>
<MdOutlineKeyboardBackspace className='w-[50px] h-[50px] text-gray-600 ' />
        </div>
        <div className=' bg-white  border-4 rounded-full
        border-[#39fc12] shadow-gray-400 shadow-lg  relative' onClick={()=>image.current.click()} >
          
            <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
                <img src={frontendImage} alt="" className='h-[100%]'/>
            </div>
            <div className='absolute bottom-4 right-4 w-[35px]
            h-[35px] text-gray-700 rounded-full bg-[#39fc12] flex justify-center items-center shadow-gray-400 shadow-lg'>
            <IoCameraOutline className='  w-[26px] h-[26px] text-gray-700'/></div>
            </div>
            <form className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
              <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
                <input type="text" placeholder="Enter your name" 
                className='w-[90%] h-[50px] outline-none border-2 border-[#39fc12] px-[20px] py-[10px] bg-[white]
                  rounded-lg shadow-gray-400 shadow-lg text-[19px] text-gray-700'
                  onChange={(e)=>setName(e.target.value)} value={name}/>
                <input type="text" readOnly className='w-[90%] h-[50px]
                  outline-none border-2 border-[#39fc12] px-[20px] py-[10px] bg-[white]
                rounded-lg shadow-gray-400 shadow-lg text-[19px] text-gray-400' value={userData?.userName}/>
                <input type="email" readOnly className='w-[90%] h-[50px]
                 outline-none border-2 border-[#39fc12] px-[20px] py-[10px] bg-[white]
                rounded-lg shadow-gray-400 shadow-lg text-[19px] text-gray-400' value={userData?.email}/>
                <button className='px-[20px] py-[10px] bg-[#39fc12] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] font-bold mt-[20px] text-gray-700
              hover:shadow-inner' disabled={saving}>{saving?"saving..":"Save Profile"}</button>
            </form>
        
    </div>
  )
}

export default Profile