import * as I from "immutable";
let defaultState = I.Map({

    items: I.Map(),

    query: "",

    add: I.Map({
        show: false,
        title: "",
        description: "",
        shareWith: [],

    })

});


export default (state=defaultState,action) => {
    let items;
    switch(action.type){

        case "MANAGE_TRACKS_SET_SHOW_ADD":

            return state.setIn(["add","show"],action.payload);

            break;

        case "MANAGE_TRACKS_INITIAL_VALUES":


            items = state.get("items");

            action.payload.map((item) => {
                items = items.set(item.id,I.fromJS(item));
            });


            state = state.set("items",items);


            break;

        case "MANAGE_TRACKS_VALUE":
            items = state.get("items").set(action.payload.id,I.fromJS(action.payload));

            return state.set("items",items);

            break;



        case "MANAGE_TRACKS_SET_QUERY":


            state = state.set("query",action.payload);

        case "MANAGE_TRACKS_REMOVED":


            items = state.get("items").delete(action.payload);

            return state.set("items",items);

            break;

    }

    return state;
}