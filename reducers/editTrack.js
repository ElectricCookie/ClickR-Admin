import *  as I from "immutable";
let defaultState = I.fromJS({

    id: null,
    title: "",
    description: "",
    sharedWith: I.List(),
    buttons: [],
    length: 0,
    trackUrl: null,
    ready: false,
    pos: 0,
    buttons: []


});

export default (state=defaultState,action) => {
    let sharedWith;
    switch(action.type){

        case "EDIT_TRACK_SET_TRACK":

            Object.keys(action.payload).map((key) => {

                state = state.set(key,I.fromJS(action.payload[key]));

            });

            break;

        case "EDIT_TRACK_RESET":

            state = defaultState;

            break;

        case "EDIT_TRACK_TOGGLE_PLAY":

            state = state
                .set("playing",!state.get("playing"));

            break;

        case "EDIT_TRACK_SET_URL":

            state = state.set("filePath",action.payload);

            break;

        case "EDIT_TRACK_SEEK":

            state = state.set("pos",action.payload);

            break;

        case "EDIT_TRACK_ADD_BUTTON":

            state = state.set("buttons",state.get("buttons").push(I.fromJS({
                key: "",
                label: "",
                enable: -1,
                disable: -1,
                skipOnClick: false
            })));

            break;


        case "EDIT_TRACK_SET_BUTTON_PARAM":

            let buttons = state.get("buttons");

            let { index, key, value } = action.payload;

            buttons = buttons.set(index,buttons.get(index).set(key,value));

            state = state.set("buttons",buttons);


        case "EDIT_TRACK_SET_LENGTH":

            state = state.set("length",action.payload).set("ready",true);

            break;


        case "EDIT_TRACK_ADD_SHARE":

            sharedWith = state.get("sharedWith");
            sharedWith = sharedWith.push(I.fromJS(action.payload));
            state = state.set("sharedWith",sharedWith);

            break;

        case "EDIT_TRACK_REMOVE_SHARE":

            sharedWith = state.get("sharedWith");
            sharedWith = sharedWith.filter((item) => {
                return item != action.payload;
            });
            state = state.set("sharedWith",sharedWith);

            break;


        case "EDIT_TRACK_UPDATE_VALUE":


            state  = state.set(action.payload.key,action.payload.value);

            break;




    }


    return state;
}