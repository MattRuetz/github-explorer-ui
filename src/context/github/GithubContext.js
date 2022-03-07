import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
    // Initial values for global context
    const initialState = {
        users: [],
        loading: false,
    };

    const [state, dispatch] = useReducer(githubReducer, initialState);

    // Get search results from API
    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text,
        });

        const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token${GITHUB_TOKEN}`,
            },
        });

        const { items } = await res.json();

        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    };

    // Set loading
    const setLoading = () => {
        dispatch({ type: 'SET_LOADING' });
    };

    // Clear list of results by clearing users from state
    const clearUsers = () => {
        dispatch({ type: 'CLEAR_USERS' });
    };

    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                loading: state.loading,
                searchUsers,
                clearUsers,
            }}
        >
            {children}
        </GithubContext.Provider>
    );
};

export default GithubContext;
