import *  as I from "immutable";
let defaultState = I.Map({
    show: false,
    title: "",
    description: "",
    file: null,
    uploading: false
});


export default (state=defaultState,action) => {
    switch(action.type){

        case "NEW_TRACK_SET_SHOW":

            return state.set("show",action.payload);

            break;
        case "NEW_TRACK_SET_FILE":

            return state.set("file",action.payload);

            break;

        case "NEW_TRACK_SET_FIELD":

            return state.set(action.payload.field,action.payload.value);

            break;
    }
    return state;
}