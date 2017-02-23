import * as I from "immutable";


const defaultState = I.Map({
    username: "",
    status: "idle",
    loaded: false,
    drawer: false
});

export default (state=defaultState,action) =>{

    switch(action.type){

        case "ACCOUNT_FETCH_STARTED":

            return state.set("status","fetching");

            break;

        case "ACCOUNT_FETCH_SUCCEEDED":

            state  = state.set("status","idle")
                .set("error",null)
                .set("loaded",true);

            Object.keys(action.payload).map((key) => {
                state = state.set(key,I.fromJS(action.payload[key]));
            });

            return state;

            break;

        case "ACCOUNT_FETCH_FAILED":


            return state.set("status","failed").set("error",action.payload);

            break;

        case "ACCOUNT_LOGGED_OUT":

            return state.set("status","idle").set("loaded",false).set("error",null);

            break;

        case "ACCOUNT_DRAWER_TOGGLE":

            return state.set("drawer",action.payload != null ? action.payload : !state.get("drawer"));

            break;


    }

    return state;
}