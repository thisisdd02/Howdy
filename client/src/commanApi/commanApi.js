const backendUrl = `${process.env.REACT_APP_BACKEND_URL}`

export const SummaryApi =  {

    register :{
        url : `${backendUrl}/api/register`
    },
    verifyEmail:{
        url : `${backendUrl}/api/verify-email` 
    },
    verifyPassword:{ 
        url : `${backendUrl}/api/verify-password`
    },
    userDetails:{
        url : `${backendUrl}/api/user-detail`
    },
    updateUser:{
        url : `${backendUrl}/api/update-user`
    },
    searchUser:{
        url : `${backendUrl}/api/search-user`
    }

    

}