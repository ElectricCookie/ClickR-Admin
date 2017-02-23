import * as I from "immutable";


let defaultState = I.Map({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    error: null,
    status: "idle"

});





export default (state=defaultState,action) => {
    switch(action.type){

        case "REGISTER_SET_INPUT":

            state = state.set(action.payload.key,action.payload.value);
            break;

        case "REGISTER_STARTED":

            state = state.set("status","pending").set("usernameError",null).set("emailError",null).set("passwordError",null);

            break;
        case "REGISTER_DONE":

            if(action.payload.err != null){
                switch(action.payload.err.errorCode){
                    case "usernameTaken":
                        state = state.set("usernameError","This username is already taken");
                        break;
                    case "emailTaken":
                        state = state.set("emailError","This email is already used");
                        break;
                    case "passwordMismatch":
                        state = state.set("passwordError","Passwords don\'t match");
                        break;

                    default:
                        state = state.set("usernameError","Something went wrong. Try again later");
                        break;
                }
            }

            break;

    }


    return state;
}