import { GET_POST_ERRORS } from "../actions/post.action";
import { GET_USER_ERRORS } from "../actions/user.actions";


const initialState = {postError: [], userError: []};

export default function errorReducer(state = initialState, action){
    switch (action.type) {
        case GET_POST_ERRORS:
            return{
                postError: action.payload,
                userError: []
            } 
        case GET_USER_ERRORS:
            return{
                postError: [],
                userError: action.payload
            } 
        default:
            return state;
    }
}