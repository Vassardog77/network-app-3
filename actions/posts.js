//ported to react native
import * as api from '../api'

export const getPosts = () => async (dispatch) => {             //creates getPost function
    try {
        const { data } = await api.fetchPosts() //comes from api index.js

        dispatch({ type: 'FETCH_ALL', payload: data })
    } catch (error) {
        console.log(error.message)
    }
}

export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post) //comes from api index.js 

        dispatch({ type: 'CREATE', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id)
        dispatch({ type: 'DELETE', payload: id })
    } catch (error) {
        console.log(error)
    }
}