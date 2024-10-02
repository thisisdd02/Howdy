import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import RegisterPage from '../pages/RegisterPage'
import CheckEmailPage from '../pages/checkEmailPage'
import CheckPasswordPage from '../pages/checkPasswordPage'
import Home from '../pages/Home'
import MessagePage from '../components/MessagePage'
import AuthLayout from '../layout/AuthLayout'

const router = createBrowserRouter([
    {
      path:'/',
      element: <App/>,
      children: [
        {
            path: 'register',
            element: <AuthLayout><RegisterPage/></AuthLayout>
        },
        {
            path: 'verify-email',
            element:<AuthLayout> <CheckEmailPage/></AuthLayout>
        },
        {
            path: 'verify-password',
            element:<AuthLayout><CheckPasswordPage/></AuthLayout> 
        },
        {
            path: '',
            element: <Home/>,
            children:[
                {
                    path: ':userId',
                    element: <MessagePage/>
                }
            ]
        }
       
      ]
    } ,

])

export default router