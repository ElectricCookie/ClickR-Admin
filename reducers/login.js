
import *  as I from "immutable";


const defaultState = I.Map({
    username: "",
    password: "",
    status: "idle",
    error: null
});

export default  (state=defaultState,action) => {
    switch(action.type){

        case "LOGIN_CHANGE_USERANME":
            return state.set("username",action.payload);
            break;
        case "LOGIN_CHANGE_PASSWORD":
            return state.set("password",action.payload);
            break;
        case "LOGIN_SUBMIT":
            state = state.set("status","pending").set("error",null);
            break;
        case "LOGIN_FAILED":
            state = state.set("error",I.fromJS(action.payload)).set("status","idle");
            break;
        case "LOGIN_SUCCEEDED":
            return state.set("status","idle");
            break;

    }

    return state;

}