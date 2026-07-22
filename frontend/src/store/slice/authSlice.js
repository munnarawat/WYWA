import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticate : false,
        isLoading:true
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticate = true;
            state.isLoading = false;
        },
        clearUser:(state)=>{
            state.user = null;
            state.isAuthenticate = false;
            state.isLoading = false;
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload;
        },
        updateMywaAccess:(state,action)=>{
            if(state.user){
                state.user = {
                    ...state.user,
                   isMywaFamilyMember:action.payload
                }
            }
        },
        updateLibraryAccess:(state,action)=>{
            if(state.user){
            state.user ={
                ...state.user,
                isLibraryMember:action.payload
            }
            }
        }
    }
});

export const {setUser, clearUser, setLoading , updateMywaAccess,updateLibraryAccess} = authSlice.actions;

export default authSlice.reducer;