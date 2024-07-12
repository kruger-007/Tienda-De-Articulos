import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
    isLoggedIn: false,
    role: 'client'
};

const initialState = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth'))
    : defaultState;

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.isLoggedIn = true;
            state.role = action.payload.role;

            localStorage.setItem('auth', JSON.stringify({
                isLoggedIn: state.isLoggedIn,
                role: state.role,
            }));
        },
        logOut: (state) => {
            state.isLoggedIn = defaultState.isLoggedIn;
            state.role = defaultState.role;
            localStorage.removeItem('auth');
        },
    },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;