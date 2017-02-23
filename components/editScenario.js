import {connect} from "react-redux";
import {Card, CardTitle, CardText, CardActions} from "material-ui/Card";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import Toggle from "material-ui/Toggle";
import CircularProgress from "material-ui/CircularProgress";
import UserChip from "./userChip";
import Dialog from "material-ui/Dialog";
import TrackList from "./trackList";
import ApiClient from "./ApiClient";
import Avatar from "material-ui/Avatar";
import TrackItem from "./trackItem";
import {browserHistory, withRouter} from "react-router";
import {List, ListItem} from "material-ui/List";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import {grey400} from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import SearchUser from "./searchUser";

@withRouter
@connect( (state) =>{
    return {
        editScenario: state.editScenario,
        manageTracks: state.manageTracks
    }
})
export default class EditScenario extends React.Component{


    componentDidMount(){
        this.loadTestScenario(this.props.params.id);
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this))
    }

    updateValue(key,e,v){

        let value = e != null ? e.target.value : v;

        this.props.dispatch({
            type: "EDIT_SCENARIO_SET_VALUE",
            payload: {
                key,
                value
            }
        });
    }
    changeQuery(e){
        this.props.dispatch({
            type: "MANAGE_TRACKS_SET_QUERY",
            payload: e.target.value
        })
    }

    loadTestScenario(id){
        if(this.request != null){
            this.request.cancel();
        }

        this.request = ApiClient.request("testScenarios","streamSingle",{
            id: this.props.params.id
        },(err,res) => {
            if(err == null){
                this.props.dispatch({
                    type: "EDIT_SCENARIO_SET_SCENARIO",
                    payload: res
                });

            }else{
                // Implement error dialog
                browserHistory.goBack();
            }
        });

    }

    routerWillLeave(nextLocation) {
        if (this.props.editScenario.get("unsaved")){
            return 'Your work is not saved! Are you sure you want to leave?'
        }
    }


    addTrack(id){

        this.props.dispatch({
            type: "EDIT_SCENARIO_ADD_TRACK",
            payload: id
        })

    }

    delete(){

        if(window.confirm("Are you sure you want to delete this test-scenario?")){
            let { editScenario } = this.props;
            ApiClient.request("testScenarios","delete",{
                id: editScenario.get("scenario").get("id")
            },(err,res) => {
                if(err != null){

                    this.props.dispatch({
                        type: "SNACKBAR_SHOW",
                        payload: {
                            message: "Deleting failed"
                        }
                    })

                }else{
                    this.props.dispatch({
                        type: "SNACKBAR_SHOW",
                        payload: {
                            message: "Deleted"
                        }
                    })
                    browserHistory.goBack();
                }
            })
        }

    }

    save(){
        let { editScenario } = this.props;
        ApiClient.request("testScenarios","update",{
            id: editScenario.get("scenario").get("id"),
            item: {
                title: editScenario.get("scenario").get("title"),
                description: editScenario.get("scenario").get("description"),
                isPrivate: editScenario.get("scenario").get("isPrivate"),
                allowAutoPriority: editScenario.get("scenario").get("allowAutoPriority"),
                sharedWith: editScenario.get("scenario").get("sharedWith"),
                invitedProbands: editScenario.get("scenario").get("invitedProbands"),
                tracks: editScenario.get("scenario").get("tracks")
            }
        },(err,res) => {
            if(err != null){



                this.props.dispatch({
                    type: "SNACKBAR_SHOW",
                    payload: {
                        message: "Saving failed"
                    }
                })

            }else{
                this.props.dispatch({
                    type: "SNACKBAR_SHOW",
                    payload: {
                        message: "Saved changes"
                    }
                })

                this.props.dispatch({
                    type: "EDIT_SCENARIO_SAVED"
                })
            }
        });

    }

    addShare(item){
        this.props.dispatch({
            type: "EDIT_SCENARIO_ADD_SHARE",
            payload: item.id
        })
    }


    addInvite(item){
        this.props.dispatch({
            type: "EDIT_SCENARIO_ADD_INVITE",
            payload: item.id
        })
    }

    handleShareDelete(id){
        this.props.dispatch({
            type: "EDIT_SCENARIO_DELETE_SHARE",
            payload: id
        })
    }

    handleInviteDelete(id){
        this.props.dispatch({
            type: "EDIT_SCENARIO_DELETE_INVITE",
            payload: id
        })
    }



    showTrackPicker(){
        this.props.dispatch({
            type: "EDIT_SCENARIO_SHOW_ADD_TRACK"
        })
    }

    hideTrackPicker(){
        this.props.dispatch({
            type: "EDIT_SCENARIO_HIDE_ADD_TRACK"
        })
    }

    removeTrack(index){

        this.props.dispatch({
            type: "EDIT_SCENARIO_REMOVE_TRACK",
            payload: index
        })

    }

    render(){

        let { editScenario, manageTracks } = this.props;

        let scenario = editScenario.get("scenario");


        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltip="more"
                tooltipPosition="bottom-left"
            >
                <MoreVertIcon color={grey400} />
            </IconButton>
        );

        if(!editScenario.get("ready")){
            return <div className="center"><CircularProgress/></div>;
        }


        return(
            <div>

                <Dialog
                    title="Add a track"
                    autoScrollBodyContent={true}
                    open={editScenario.get("showAddTrack")}
                    onRequestClose={this.hideTrackPicker.bind(this)}
                >
                    <TextField value={manageTracks.get("query")} onChange={this.changeQuery.bind(this)} name="search-input" placeholder="Search..." />
                    <TrackList
                        onClick={this.addTrack.bind(this)}
                    />
                </Dialog>

                <Toolbar>
                    <ToolbarGroup>
                        <FlatButton label="Back" onClick={ () => browserHistory.goBack() } />
                        <ToolbarTitle text="Edit Scenario" />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <FlatButton onClick={this.delete.bind(this)} secondary={true} label="Delete" />
                        <RaisedButton onClick={this.save.bind(this)} primary={true} label="Save" />
                    </ToolbarGroup>
                </Toolbar>
                <div className="row">

                    <div className="col-md-8 padded">


                        <Card>
                            <CardText>
                                <TextField
                                    value={scenario.get("title")}
                                    onChange={this.updateValue.bind(this,"title")}
                                    fullWidth={true}
                                    floatingLabelText="Title"
                                />
                                <TextField
                                    fullWidth={true}
                                    value={scenario.get("description")}
                                    onChange={this.updateValue.bind(this,"description")}
                                    floatingLabelText="Description" />
                                <br/>
                                <br/>
                                <Toggle
                                    onToggle={this.updateValue.bind(this,"isPrivate",null,!scenario.get("isPrivate"))}
                                    toggled={scenario.get("isPrivate")}
                                    label={"Private"}
                                />
                                <br/>
                                <Toggle
                                    onToggle={this.updateValue.bind(this,"allowPrioritySort",null,!scenario.get("allowPrioritySort"))}
                                    toggled={scenario.get("allowPrioritySort")}
                                    label="Allow Track priority Sorting"
                                />
                                <br/>

                            </CardText>

                        </Card>
                        <br/>
                        <Card>
                            <CardTitle title="Tracks" />
                            <CardActions>
                                <FlatButton onClick={this.showTrackPicker.bind(this)} primary={true} label="Add" />
                            </CardActions>
                            <hr/>
                            {  scenario.get("tracks").size == 0 ? <CardText><p>This scenario won't be shown to probands unless at least one track is added</p></CardText> : null }
                            <List>
                                {
                                    scenario.get("tracks").map((item,index) => {
                                        return(
                                            <TrackItem menu={
                                                <IconMenu iconButtonElement={iconButtonElement}>
                                                    <MenuItem onClick={ () => browserHistory.push("/edit-track/"+item) }>Show</MenuItem>
                                                    <MenuItem onClick={this.removeTrack.bind(this,index)}>Remove</MenuItem>

                                                </IconMenu>
                                            }

                                            id={item}
                                            key={item}
                                            />
                                        )
                                    })

                                }
                            </List>
                        </Card>

                    </div>

                    <div className="col-md-4 padded">

                        <Card>
                            <CardText>
                                <div className="row">
                                    <div className="col-md-6">
                                        <b style={{lineHeight: "40px"}}>Owner</b>
                                    </div>
                                    <div className="col-md-6">
                                        <UserChip userId={ scenario.get("ownerId") } />
                                    </div>
                                </div>
                            </CardText>
                            <hr/>
                            <CardText>
                                <b>Shared with</b>
                                {
                                    scenario.get("sharedWith").map((item) => {
                                        return(
                                            <UserChip onDelete={this.handleShareDelete.bind(this,item)} userId={ item } />
                                        )
                                    })
                                }
                                <SearchUser onSelect={this.addShare.bind(this)} />
                            </CardText>
                            <hr/>
                            <CardText>
                                <b>Invited probands</b>
                                {
                                    scenario.get("invitedProbands").map((item) => {
                                        return(
                                            <UserChip onDelete={this.handleInviteDelete.bind(this,item)} userId={ item } />
                                        )
                                    })
                                }
                                <SearchUser onSelect={this.addInvite.bind(this)} />
                            </CardText>
                            <hr/>
                        </Card>
                        <br/>
                        <Card>
                            <CardTitle title="Results" />
                            <hr/>
                            <List>
                                <ListItem
                                    leftAvatar={
                                        <Avatar src="https://gravatar.com/avatar/705b4342c29782064bd9caa633a12f06" />} primaryText="Track 1" secondaryText="Username &middot; 18.09.2016 12:40" />
                            </List>
                        </Card>

                    </div>


                </div>
            </div>
        );
    }
}