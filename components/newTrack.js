import Dropzone from "react-dropzone";
import TextField from "material-ui/TextField";
import ApiClient from "./apiClient";
import Paper from 'material-ui/Paper';
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import * as request from "superagent";
import { connect } from "react-redux";

@connect((state) => {
    return {
        newTrack: state.newTrack
    }
})
export default class NewTrack extends React.Component{



    onDrop(file){
        this.props.dispatch({
            type: "NEW_TRACK_SET_FILE",
            payload: file[0]
        });
    }

    setShow(state){
        this.props.dispatch({
            type: "NEW_TRACK_SET_SHOW",
            payload: state
        })
    }

    updateField(field,e){
        this.props.dispatch({
            type: "NEW_TRACK_SET_FIELD",
            payload: {
                field,
                value: e.target.value
            }
        })
    }

    submit(){
        let { newTrack } = this.props;
        ApiClient.upload("tracks","create",newTrack.get("file"),{
            title: newTrack.get("title"),
            description: newTrack.get("description"),
        },(err,res) => {
            if(err == null){
                // Upload the damn file
                this.setShow(false);
            }
        })

    }

    render(){

        let { newTrack } = this.props;

        return(
            <Dialog
                actions={[
                        <FlatButton label="Submit" onClick={this.submit.bind(this)} />
                ]}
                title="New Track"
                modal={false}
                onRequestClose={this.setShow.bind(this,false)}
                open={newTrack.get("show")}
            >
                <TextField
                    fullWidth={true}
                    value={newTrack.get("title")}
                    onChange={this.updateField.bind(this,"title")}
                    placeholder="Title" />
                <br/>
                <TextField
                    fullWidth={true}
                    value={newTrack.get("description")}
                    onChange={this.updateField.bind(this,"description")}
                    placeholder="Description" />
                <br/>
                <Dropzone accept={"audio/mp3,audio/mpeg"} onDrop={this.onDrop.bind(this)} style={{}}>
                    <TextField
                        fullWidth={true}
                        value={newTrack.get("file") != null ? newTrack.get("file").name : ""}
                        placeholder="Click to select a file or Drop here" />
                </Dropzone>
                <br/>
                {
                    newTrack.get("file") != null ? <audio src={newTrack.get("file").preview} controls  /> : null
                }
            </Dialog>
        )
    }

}