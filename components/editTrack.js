import ApiClient from "./apiClient";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import PlayIcon from "material-ui/svg-icons/av/play-arrow";
import PauseIcon from "material-ui/svg-icons/av/pause";
import FloatingActionButton from "material-ui/FloatingActionButton";
import CircularProgress from "material-ui/CircularProgress";
import SearchUser from "./searchUser";
import WaveSurfer from "react-wavesurfer";
import UserChip from "./userChip";
import {Card, CardTitle, CardText, CardMedia} from "material-ui/Card";

@connect((state) => {
    return {
        editTrack: state.editTrack
    }
})
export default class EditTrack extends React.Component{


    constructor(){
        super();
    }

    componentDidUpdate(prevProps){
        if(prevProps.params.id != this.props.params.id){
            this.loadTrack(this.props.params.id);
        }
    }

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    };

    componentDidMount(){
        this.loadTrack(this.props.params.id);
    }



    loadTrack(id){
        if(this.request != null){
            this.request.cancel();
        }


        this.request = ApiClient.request("tracks","streamSingle",{
            id: this.props.params.id
        },(err,res) => {
            console.log(err,res);
            if(err == null){
                this.props.dispatch({
                    type: "EDIT_TRACK_SET_TRACK",
                    payload: res
                });

            }else{
                // Implement error dialog
                browserHistory.goBack();
            }
        });

    }

    componentWillUnmount(){
        this.props.dispatch({
            type: "EDIT_TRACK_RESET"
        })
    }

    onPosChange(e){

        if(this.lastCall == null){
            this.lastCall = Date.now()-200
        }

        if(Date.now()-this.lastCall > 200){

            this.props.dispatch({
                type: "EDIT_TRACK_SEEK",
                payload: e.originalArgs[0]
            });

            this.lastCall = Date.now();

        }


    }

    leadingZero(input){
        return input < 10 ?  "0"+input: input;
    }

    convertSeconds(input){

        let left = input;
        let hours = Math.floor(left/3600);
        left = left-hours*36000;
        let minutes = Math.floor(left/60);
        let seconds = Math.floor(left-minutes*60);


        return this.leadingZero(hours)+":"+this.leadingZero(minutes)+":"+this.leadingZero(seconds);

    }

    ready(e){
        this.props.dispatch({
            type: "EDIT_TRACK_SET_LENGTH",
            payload: e.wavesurfer.backend.source.buffer.duration
        })
    }

    getPlayer(){
        let { editTrack } = this.props;
        console.log("http://localhost:4040/tracks/file/"+editTrack.get("id"));
        return(
            <WaveSurfer
                audioFile={"http://localhost:4040/tracks/file/"+editTrack.get("id")}
                onPosChange={this.onPosChange.bind(this)}
                playing={editTrack.get("playing")}
                onReady={this.ready.bind(this)}
                options={{
                    barWidth: 1 ,
                    progressColor: this.context.muiTheme.palette.primary1Color
                }}

            />
        )
    }

    handleShareDelete(id){
        this.props.dispatch({
            type: "EDIT_TRACK_REMOVE_SHARE",
            payload: id
        })
    }

    getLoader(){

        return(
            <div className="center">
                <CircularProgress />
            </div>
        )

    }


    addButton(){

        this.props.dispatch({
            type: "EDIT_TRACK_ADD_BUTTON"
        })

    }

    togglePlay(){
        this.props.dispatch({
            type: "EDIT_TRACK_TOGGLE_PLAY"
        })
    }

    getPlaybackControls(){
        let { editTrack } = this.props;

        return(
            <div style={{position: "relative", padding: "2rem"}}>
                <b><span>{ this.convertSeconds(editTrack.get("pos")) }</span><br/><span>{ Math.floor(editTrack.get("pos"))+"s"}</span></b>
                <FloatingActionButton onClick={this.togglePlay.bind(this)} className="center">
                    { editTrack.get("playing") ?  <PauseIcon/> : <PlayIcon/> }
                </FloatingActionButton>
                <b className="pull-right">-{ this.convertSeconds(editTrack.get("length")-editTrack.get("pos")) }</b>
            </div>
        )

    }

    updateValue(key,e){
        this.props.dispatch({
            type: "EDIT_TRACK_UPDATE_VALUE",
            payload: {
                key,
                value: e.target.value
            }
        })
    }


    updateButtonParams(index,key,e){
        this.props.dispatch({
            type: "EDIT_TRACK_SET_BUTTON_PARAM",
            payload: {
                index,
                key,
                value: e.target.value
            }
        })
    }

    updateButtonToggle(index,key,newValue){
        this.props.dispatch({
            type: "EDIT_TRACK_SET_BUTTON_PARAM",
            payload: {
                index,
                key,
                value: newValue
            }
        })
    }

    save(){

        let { editTrack } = this.props;

        ApiClient.request("tracks","update",{
            id: editTrack.get("id"),
            item: {
                title: editTrack.get("title"),
                description: editTrack.get("description"),
                buttons: editTrack.get("buttons"),
                sharedWith: editTrack.get("sharedWith"),
            }

        },(err,res) => {
            if(err != null){
                this.props.dispatch({
                    type: "SNACKBAR_SHOW",
                    payload: {
                        message: "Saving failed."
                    }
                })
            }else{
                console.log("Saved");
                this.props.dispatch({
                    type: "SNACKBAR_SHOW",
                    payload: {
                        message: "Saved successfully."
                    }
                })
            }
        })

    }


    delete(){

        if(window.confirm("Are you sure you want to delete this track?")){

            ApiClient.request("tracks","delete",{ id: this.props.editTrack.get("id") },(err,res) => {


                if(err != null){

                    this.props.dispatch({
                        type: "SNACKBAR_SHOW",
                        payload: {
                            message: "Deleting Track failed"
                        }
                    })


                }else{
                    this.props.dispatch({
                        type: "SNACKBAR_SHOW",
                        payload: {
                            message: "Deleted Track"
                        }
                    })
                }

            });



        }

    }

    searchUserAdd(item){
        console.log(item);
        this.props.dispatch({
            type: "EDIT_TRACK_ADD_SHARE",
            payload: item.id
        })
    }

    render(){
        let { editTrack } = this.props;


        return(
          <div>
            <Toolbar>
                <ToolbarGroup>
                    <FlatButton label="Back" onClick={ () => browserHistory.goBack() } />
                    <ToolbarTitle text="Edit Track" />
                </ToolbarGroup>

                <ToolbarGroup>
                    <FlatButton onClick={this.delete.bind(this)} secondary={true} label="Delete" />
                    <RaisedButton onClick={this.save.bind(this)} primary={true} label="Save" />
                </ToolbarGroup>
            </Toolbar>
            <div className="container padded">

                <Card>
                    <CardMedia>
                        <div style={{height: "128px"}}>
                            { editTrack.get("id") != null ? this.getPlayer() : null }
                            { !editTrack.get("ready") ? this.getLoader() : null }
                        </div>
                    </CardMedia>

                    {this.getPlaybackControls()}

                    <CardText>
                        <TextField
                            fullWidth={true}
                            onChange={this.updateValue.bind(this,"title")}
                            name="title"
                            floatingLabelText="Title"
                            value={editTrack.get("title")}
                        />
                        <TextField
                            fullWidth={true}
                            name="description"
                            onChange={this.updateValue.bind(this,"description")}
                            floatingLabelText="Description"
                            value={editTrack.get("description")}
                        />
                    </CardText>


                    <hr/>

                    <CardTitle title="Audience Response Buttons" />

                    <div style={{display: "flex",flexWrap: "wrap", background: "#f5f5f5"}}>
                    {
                        editTrack.get("buttons").map((button,index) => {
                            return(
                                <Card style={{ margin: "1rem" }}>
                                    <CardText>
                                        <TextField onChange={ this.updateButtonParams.bind(this,index,"label") } floatingLabelText="Label" name={index+"label"} value={button.get("label")} />
                                        <br/>
                                        <TextField onChange={ this.updateButtonParams.bind(this,index,"key") } floatingLabelText="Key" name={index+"key"} value={button.get("key")} />
                                        <br/>
                                        <TextField onChange={ this.updateButtonParams.bind(this,index,"start") } floatingLabelText="Enable at" name={index+"start"} value={button.get("start")} />
                                        <br/>
                                        <TextField onChange={ this.updateButtonParams.bind(this,index,"end") } floatingLabelText="Disable at" name={index+"end"} value={button.get("end")} />
                                        <br/>
                                        <Toggle label="Skip on click" toggled={button.get("skipOnClick")} onToggle={this.updateButtonToggle.bind(this,index,"skipOnClick",!button.get("skipOnClick"))} />
                                    </CardText>
                                </Card>
                            );
                        })
                    }
                        <Card style={{margin: "1rem", position: "relative", minWidth: "256px"}}>
                            <div className="center">
                                <FlatButton onClick={ this.addButton.bind(this) } primary={true} label="New Button" />
                            </div>
                        </Card>

                    </div>

                    <CardTitle title="Shared with" />
                    <CardText>

                        {

                            editTrack.get("sharedWith").map((id) => {
                                return(
                                    <UserChip onDelete={this.handleShareDelete.bind(this,id)} userId={id} />
                                );
                            })
                        }


                        <SearchUser onSelect={this.searchUserAdd.bind(this)} />
                    </CardText>


                </Card>

            </div>

          </div>
        );
    }

}
