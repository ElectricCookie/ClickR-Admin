import ApiClient from "./ApiClient";
import {List,ListItem} from "material-ui/List";
import { Card, CardHeader, CardActions } from "material-ui/Card";
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from 'material-ui/svg-icons/content/add';
import TrackItem from "./trackItem";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import Toggle from "material-ui/Toggle";
import FlatButton from "material-ui/FlatButton";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from "material-ui/TextField";
import styles from "./styles";
import UserAvatar from "./userAvatar";


@connect((state) => {
    return {
        manageScenarios: state.manageScenarios
    }
})
export default class Scenarios  extends React.Component{


    componentDidMount(){

    }

    showAdd(newValue){
        this.props.dispatch({
            type: "MANAGE_SCENARIOS_TOGGLE_ADD",
            payload: newValue
        })
    }

    create(e){
        e.preventDefault();

        ApiClient.request("testScenarios","create",this.props.manageScenarios.get("add").toJS(),(err,result) => {
            console.log(err,result);
            if(err != null){

            }else{
                this.showAdd(false);
                this.props.dispatch({
                    type: "SNACKBAR_SHOW",
                    payload: {
                        message: "New Scenario created"
                    }
                })
            }
        })
    }

    updateAddValue(key,e){
        this.props.dispatch({
            type: "MANAGE_SCENARIOS_UPDATE_ADD_VALUE",
            payload: {
                key,
                value: e.target.value
            }
        })
    }
    updateTogglePrivate(){
        this.props.dispatch({
            type: "MANAGE_SCENARIOS_UPDATE_ADD_VALUE",
            payload: {
                key: "isPrivate",
                value: !this.props.manageScenarios.get("add").get("isPrivate")
            }
        })
    }

    render(){

        let {manageScenarios} = this.props;


        let actions = [

        ];


        return <div>

                <Dialog
                    title="New Test Scenario"
                    actions={actions}
                    modal={false}
                    open={manageScenarios.get("showAdd")}
                    onRequestClose={this.showAdd.bind(this,false)}
                >
                    <form onSubmit={this.create.bind(this)}>
                        <TextField minLength={2} maxLength={32} onChange={this.updateAddValue.bind(this,"title")} value={manageScenarios.get("add").get("title")} fullWidth={true} required hintText="Title" />
                        <br/>
                        <TextField required onChange={this.updateAddValue.bind(this,"description")} value={manageScenarios.get("add").get("description")} fullWidth={true} hintText="Description" />
                        <br/>
                        <Toggle onToggle={this.updateTogglePrivate.bind(this)} toggled={manageScenarios.get("add").get("isPrivate")} label="Private" />

                        <div style={{ float: "right", marginTop: "2rem" }}>
                            <FlatButton onClick={this.showAdd.bind(this,false)} label="Cancel" />
                            <FlatButton type="submit" label="Create" />
                        </div>
                    </form>
                </Dialog>

            <Toolbar>

                <ToolbarGroup>
                    <ToolbarTitle text="Manage Scenarios" />
                </ToolbarGroup>
                <ToolbarGroup style={{ alignItems: "center" }}>
                    <TextField name="search-input" placeholder="Search..." />
                </ToolbarGroup>

            </Toolbar>

            <div style={{display: "flex", flexWrap: "wrap"}}>
                {
                    manageScenarios.get("items").map((item) => {
                        return (
                            <Card
                                key={item.get("id")}
                                style={{margin: "10px"}}
                            >
                                <List>
                                    <ListItem
                                        leftAvatar={<UserAvatar userId={item.get("ownerId")} />}
                                        primaryText={item.get("title")}
                                        onClick={() => browserHistory.push("/edit-scenario/"+item.get("id"))}
                                        secondaryText={item.get("description")}
                                    />
                                    <Subheader>Tracks</Subheader>
                                    {
                                        item.get("tracks").map((trackId) => {
                                            return(
                                                <TrackItem onClick={
                                                    () => browserHistory.push("/edit-track/"+trackId)
                                                } id={trackId} />
                                            )

                                        })
                                    }
                                </List>

                            </Card>
                        )
                    })
                }
            </div>
            <FloatingActionButton onClick={this.showAdd.bind(this,true)} secondary={true} style={styles.fab}>
                <ContentAdd />
            </FloatingActionButton>
        </div>

    }
}