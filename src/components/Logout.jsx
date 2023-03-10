import { useDispatch, useSelector } from "react-redux"
import { destroyCredentials } from "@/store/slices/auth/authSlice"
import { useEffect } from "react"
import { useLogoutMutation } from "@/services/Auth"
import { setMessages } from "@/store/slices/notify/notifySlice"

let tokenKey = null

const Logout = () => {

    const dispatch = useDispatch()

    const [logout] = useLogoutMutation()

    const token = useSelector( state => state.auth.token )
    
    useEffect( () => {

        if( tokenKey !== token ) {
            
            ( async () => {
            
                await logout()                

            } )()

            dispatch( destroyCredentials() )
            dispatch( setMessages( 'See you soon!' ) )

            tokenKey = token
        
        }
            
    }, [] )    
    
    return (
        <>Logout</>
    )
}

export default Logout