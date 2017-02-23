import * as I from "immutable";

let defaultState = I.Map({
    query: "",
    items: []
});


export default (state=defaultState,action) =>{

    switch(action.type){
        case "SEARCH_USER_SET_QUERY":

            state = state.set("query",action.payload);

            break;

        case "SEARCH_USER_SET_SUGGESTIONS":

            state = state.set("items",action.payload.map((item) => {
                return {
                    value: item,
                    text: item.fullName + " - " + item.username
                }
            }));

            break;

    }


    return state;
}