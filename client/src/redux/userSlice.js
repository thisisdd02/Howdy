import { createSlice } from '@reduxjs/toolkit'

const initialState = {
_id:"",
 name:"",
 email:"",
 password:"",
 token:"",
 profilePic:"",
 onlineUser:[],
 socketConnection:null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser :(state,action)=>{
        state._id = action.payload._id
        state.name = action.payload.name
        state.email = action.payload.email
        state.password = action.payload.password
        state.profilePic=action.payload.profilePic
    },
    setToken:(state,action)=>{
        state.token = action.payload
    },
    logout:(state,action)=>{
        state._id = ""
        state.name = ""
        state.email = ""
        state.password = ""
        state.token = ""
        state.socketConnection=null
    },
    setOnlineUser:(state,action)=>{
      state.onlineUser = action.payload
    },
    setSocketConnection:(state,action)=>{
      state.socketConnection = action.payload
    }
    
  },
})

// Action creators are generated for each case reducer function
export const { setUser,setToken, logout ,setOnlineUser,setSocketConnection } = userSlice.actions

export default userSlice.reducer