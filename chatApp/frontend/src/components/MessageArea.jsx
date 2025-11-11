import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from '../assets/dp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice.js';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx';
import { serverUrl } from '../main.jsx';
import axios from 'axios';
import { setMessages } from '../redux/messageSlice.js';


function MessageArea() {

  let {selectedUser,userData,socket}=useSelector(state=>state.user)
  let dispatch=useDispatch()
  let [showPicker,setShowPicker]=useState(false)
 let [input,setInput]=useState("")
 let [frontendImage,setFrontendImage]=useState(null)
 let [backendImage,setBackendImage]=useState(null)
let image=useRef()
let {messages}=useSelector(state=>state.message)
 const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

 const handleSendMessage=async (e)=>{
   e.preventDefault()
   if(input.length==0 && backendImage==null){
     return 
   }
   try {
     let formData=new FormData()
     formData.append("message",input)
     if(backendImage){
       formData.append("image",backendImage)
     }
     let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
     dispatch(setMessages([...messages,result.data]))
     setInput("")
     setFrontendImage(null)
     setBackendImage(null)
   } catch (error) {
     console.log(error)
   }
 }
  const onEmojiClick=(emojiData)=>{
  setInput(prevInput=>prevInput+emojiData.emoji)
  setShowPicker(false)
  }
useEffect(()=>{
socket?.on("newMessage",(mess)=>{
  dispatch(setMessages([...messages,mess]))
})
return ()=>socket?.off("newMessage")
},[messages,setMessages])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-full
     bg-slate-200 boredr-l-2 border-gray-300`}>
      {selectedUser &&
      <div className='w-full h-[100vh] flex flex-col'>
       <div className='w-full h-[100px] bg-[#28b00d] rounded-b-[30px] 
          shadow-gray-400 shadow-lg  items-center flex gap-[20px]
           px-[20px]'>
             <div className='cursor-pointer'onClick={()=>dispatch(setSelectedUser(null))}  >
            <MdOutlineKeyboardBackspace className='w-[40px] h-[40px] text-white' />
                    </div>
      <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center
          shadow-lg shadow-gray-500 cursor-pointer bg-white'>
                      <img src={selectedUser?.image || dp} alt="" className='h-[100%]'/> 
      </div>
            <h1 className='font-semibold text-[20px] text-white'>{selectedUser?.name || "user"}</h1>
        </div>
        <div className='w-full h-[70%] flex flex-col
        px-[20px] overflow-auto gap-[20px] py-[20px] '>
       
        {showPicker && <div className='absolute bottom-[120px] left-[20px] 
        '><EmojiPicker width={250} height={350} className='shadow-lg z-[100]' onEmojiClick={onEmojiClick}/></div>}
    {messages && messages.map((mess)=>(
mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<ReceiverMessage image={mess.image} message={mess.message}/>
    ))}
    </div>
    </div>}
{selectedUser && 

<div className='lg:w-[70%] w-full h-[100px] fixed bottom-[20px] flex items-center justify-center
'>
  <img src={frontendImage} alt="" className='w-[80px] absolute 
  bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg '/>
      <form className='w-[95%] lg:w-[70%] max-w-[70%] bg-[#28b00d] h-[60px] rounded-full shadow-gray-400 shadow-lg
      flex items-center gap-[20px] px-[20px]' onSubmit={handleSendMessage}>
        
      <div onClick={()=>setShowPicker(prev=>!prev)} >

        <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer' />
      </div>
      <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />
      <input type="text" className='w-full h-full px-[10px] outline-none
      border-0 text-[19px] text-white bg-transparent placeholder-white' placeholder='Message' onChange={(e)=>setInput(e.target.value)} value={input}  />
<div onClick={()=>image.current.click()}>
  <FaImages className='w-[25px] h-[25px] text-white cursor-pointer'/>
</div>
{(input.length>0 || backendImage!=null) && (<button>
<MdSend className='w-[25px] h-[25px] text-white cursor-pointer'/>
</button>)}

      </form>
    </div>}
    {!selectedUser && 
    <div className='w-full h-full flex flex-col justify-center items-center'>
    <h1 className='text-gray-700 font-bold text-[50px]'>Welcome to ChatFormly</h1>
    <span className='text-gray-700 font-semibold text-[30px]'>Chat Formly !</span>
      </div>}
 
    </div>

    
  )
}

export default MessageArea

