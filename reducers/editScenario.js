import *  as I from "immutable";
let defaultState = I.fromJS({


    scenario: I.Map({}),
    ready: false,
    unsaved: false,
    showAddTrack: false

});
export default (state=defaultState,action) => {
    let sharedWith, invitedProbands;
    switch (action.type) {



        case "EDIT_SCENARIO_ADD_SHARE":

            sharedWith = state.get("scenario").get("sharedWith");
            state = state.setIn(["scenario","sharedWith"],sharedWith.push(action.payload));

            break;


        case "EDIT_SCENARIO_ADD_INVITE":

            invitedProbands = state.get("scenario").get("invitedProbands");
            state = state.setIn(["scenario","invitedProbands"],invitedProbands.push(action.payload));

            break;


        case "EDIT_SCENARIO_DELETE_SHARE":

            sharedWith = state.get("scenario").get("sharedWith");
            state = state.setIn(["scenario","sharedWith"],sharedWith.filter((item) => { return item != action.payload }));

            break;

        case "EDIT_SCENARIO_DELETE_INVITE":

            invitedProbands = state.get("scenario").get("invitedProbands");
            state = state.setIn(["scenario","invitedProbands"],invitedProbands.filter((item) => { return item != action.payload }));


            break;

        case "EDIT_SCENARIO_SET_SCENARIO":

                state = state
                    .set("scenario",I.fromJS(action.payload))
                    .set("unsaved",false)
                    .set("ready",true);

            break;

        case "EDIT_SCENARIO_SET_VALUE":


                state = state.setIn(["scenario",action.payload.key],action.payload.value);
                state = state.set("unsaved",true);

            break;

        case "EDIT_SCENARIO_SHOW_ADD_TRACK":

            state = state.set("showAddTrack",true);

            break;

        case "EDIT_SCENARIO_REMOVE_TRACK":

            state = state.setIn(["scenario","tracks"],state.getIn(["scenario","tracks"]).remove(action.payload));

            break;

        case "EDIT_SCENARIO_SAVED":

            return state.set("unsaved",false);

            break;

        case "EDIT_SCENARIO_HIDE_ADD_TRACK":

            state = state.set("showAddTrack",false);

            break;

        case "EDIT_SCENARIO_ADD_TRACK":

            let scenario = state.get("scenario");

            scenario = scenario.set("tracks",scenario.get("tracks").push(action.payload));

            state = state.set("scenario",scenario);
            state = state.set("unsaved",true).set("showAddTrack",false);

            break;

    }
    return state;
}