import { LockClosedIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRegisterMutation, useEmailVerSendMutation } from "@/services/Auth"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/auth/authSlice"
import { setErrors, setMessages } from "@/store/slices/notify/notifySlice"

const RegisterForm = () => {

    const [register, { isLoading }] = useRegisterMutation()
    const dispatch = useDispatch()
    const [emailVerSend] = useEmailVerSendMutation()

    const [userData, setUserData] = useState( {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
    } )

    const handleInput = ( e ) => {
        setUserData( prevData => { 
            return {
                ...prevData,
                [e.target.name]: e.target.value
            } 
        } )
    }

    const attemptRegister = async ( e ) => {

        e.preventDefault()

        if( ! userData.name || ! userData.email || ! userData.password || ! userData.password_confirmation ) {
            console.log( 'Please, fill in data' )
            return 
        }

        // attempt to register
        try {

            const user = await register( userData ).unwrap()
            dispatch( setCredentials( user ) )
            dispatch( setMessages( 'Registration succeeded.' ) )

            if( import.meta.env.VITE_EMAIL_VERIFICATION === 'true' ) {

                const send = await emailVerSend().unwrap()

                if( send?.message === 'success' ) {

                    dispatch( setMessages( 'Verification email sent successfully.' ) )

                }

            }
            
        } catch ( error ) {

            if( error?.data?.message ) {

                dispatch( setErrors( {
                    'message': error.data.message
                } ) )

            } else {

                dispatch( setErrors( {
                    'message': 'Something went wrong!'
                } ) )

            }
            
        }

    }

    return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
            <div>
                <img
                    className="mx-auto h-12 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign up to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}

                    <Link 
                        to="/login" 
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >Login now</Link>
                </p>
            </div>
            <form
                className="mt-8 space-y-6"
                onSubmit={attemptRegister}
            >

                <input type="hidden" name="remember" defaultValue="true" />

                <div className="-space-y-px rounded-md shadow-sm">
                
                    <div>
                        <label htmlFor="user-name" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="user-name"
                            name="name"
                            type="text"
                            onChange={handleInput}
                            required
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            onChange={handleInput}
                            required
                            className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={handleInput}
                            required
                            className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="sr-only">
                            Password Confirmation
                        </label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            onChange={handleInput}
                            required
                            className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password Confirmation"
                        />
                    </div>

                </div>

                <div>
                    <button
                        type={!isLoading ? 'submit' : 'button'}
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        { isLoading && <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span> }
                        
                        {isLoading ? 'Register ...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default RegisterForm