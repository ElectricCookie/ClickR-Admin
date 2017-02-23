import * as I from "immutable";

let defaultState = I.Map({
   connected: false
});

export default (state=defaultState,action) => {

    switch(action.type){

        case "CONNECTION_READY":
            return state.set("connected",true);
        case "CONNECTION_ERROR":
            return state.set("connected",false);

    }

    return state;
}