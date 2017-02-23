import * as I from "immutable";

let defaultState = I.fromJS({

    show: false,
    message: "",
    timeout: 4000,
    action: null,

});


export default (state=defaultState,action) => {

    switch(action.type){


        case "SNACKBAR_SHOW":
            console.log(action);
            state = state
                .set("show",true)
                .set("message",action.payload.message)
                .set("timeout",action.payload.timeout != null ? action.payload.timeout : 4000)
                .set("action",action.payload.action);


            break;

        case "SNACKBAR_HIDE":

            state = state.set("show",false);

            break;

    }
    return state;
};