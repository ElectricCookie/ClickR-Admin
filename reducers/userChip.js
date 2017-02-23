import *  as  I from "immutable";

const defaultState = I.fromJS({
    items: []
});

export default (state=defaultState,action) => {

    switch(action.type){

        case "USER_CHIP_USER_LOADED":

            let items = state.get("items").push(I.fromJS(action.payload));

            state = state.set("items",items);

            break;

    }

    return state;
}