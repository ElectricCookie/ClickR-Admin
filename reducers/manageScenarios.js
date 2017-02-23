import * as I from "immutable";
const defaultState = I.Map({
    items: I.Map(),
    showAdd: false,
    add: I.Map({
        title: "",
        description: "",
        isPrivate: true,
        invitedAdmins: [],
        invitedClients: [],
        tracks: []
    })
});



export default (state=defaultState,action) => {

    let items;

    switch(action.type){

        case "MANAGE_SCENARIOS_TOGGLE_ADD":

            state = state.set("showAdd",action.payload != null ? action.payload : !state.get("showAdd"));

            break;

        case "MANAGE_SCENARIOS_INITIAL_VALUES":


            items = state.get("items");

            action.payload.map((item) => {
                items = items.set(item.id,I.fromJS(item));
            });



            state = state.set("items",items);


            break;

        case "MANAGE_SCENARIOS_VALUE":


            let items = state.get("items").set(action.payload.id,I.fromJS(action.payload.value));

            return state.set("items",items);

            break;

        case "MANAGE_SCENARIOS_REMOVED":


            items = state.get("items").delete(action.payload);

            return state.set("items",items);

            break;

        case "MANAGE_SCENARIOS_UPDATE_ADD_VALUE":


            return state.setIn(["add",action.payload.key],action.payload.value);

            break;

    }


    return state;
}