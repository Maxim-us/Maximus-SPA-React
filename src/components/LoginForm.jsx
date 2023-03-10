import { LockClosedIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useLoginMutation } from "@/services/Auth"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/auth/authSlice"
import { setErrors, setMessages } from "@/store/slices/notify/notifySlice"

const LoginForm = () => {

    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()  

    const [userData, setUserData] = useState( {
        email: null,
        password: null
    } )

    const handleInput = ( e ) => {
        setUserData( prevData => { 
            return {
                ...prevData,
                [e.target.name]: e.target.value
            } 
        } )
    }

    const attemptLogin = async ( e ) => {

        e.preventDefault()

        if( isLoading ) return

        if( ! userData.email || ! userData.password ) {
            console.log( 'Please, fill in data.' )
            return 
        }

        try {

            const user = await login( userData ).unwrap()
            dispatch( setCredentials( user ) )
            dispatch( setMessages( 'Login succeeded.' ) )
            
        } catch ( error ) {

            if( error?.data?.error ) {

                dispatch( setErrors( {
                    'message': error.data.error
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
                Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}

                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register for an account</Link>
                
                </p>
            </div>
            <form
                onSubmit={attemptLogin}
                className="mt-8 space-y-6"
            >
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
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
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                            autoComplete="current-password"
                            onChange={handleInput}
                            required
                            className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                        </label>
                    </div>

                    <div className="text-sm">                   
                        <Link 
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            to="/forgot-password"
                        >
                            Forgot your password?
                        </Link>
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
                        
                        {isLoading ? 'Signing in ...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default LoginForm