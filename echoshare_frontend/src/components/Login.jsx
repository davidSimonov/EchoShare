import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'

import { client } from '../client'


const Login = () => {
  const navigate = useNavigate();

  const handleGoogleResponse = (response) => {
    localStorage.setItem('user', JSON.stringify(response))

    const { name, sub, picture } = response

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true })
      })
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
    
        const userInfo = await response.json();
        console.log(userInfo);
        handleGoogleResponse(userInfo)
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo' />
          </div>

          <div className='shadow-2xl'>
            <button 
              type='button'
              className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
              onClick={login}
            >
              <FcGoogle className='mr-4' /> Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
