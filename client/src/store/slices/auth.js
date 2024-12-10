import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLogin: false,
    role: '',
    name: '',
    email: '',
    id: '',
}
const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        setAuthData: (state, action) => {
            console.log(action.payload,"action.payload");
            
            state.isLogin = action.payload.isLogin,
                state.role = action.payload.role,
                state.name = action.payload.name,
                state.email = action.payload.email,
                state.id = action.payload._id
        }
    }
})

export const { setAuthData } = authSlice.actions
export default authSlice.reducer