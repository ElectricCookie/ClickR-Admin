import React from "react"
import { Card, CardTitle, CardText,CardMedia, CardActions } from "material-ui/Card";
import Dialog from 'material-ui/Dialog';
import AppBar from "material-ui/AppBar";
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from "material-ui/List"
import ApiClient from "./apiClient";
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import ViewArray from 'material-ui/svg-icons/action/view-array';
import Users from "material-ui/svg-icons/social/people";
import Snackbar from "material-ui/Snackbar";
import { browserHistory } from 'react-router';
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import CircularProgress from 'material-ui/CircularProgress';

@connect((state) => { return {  account: state.account, connection: state.connection, snackbar: state.snackbar } })
class App extends React.Component{



    componentWillMount(){

        ApiClient.on("requestError",this.handleError.bind(this));
        ApiClient.on("closed",this.onClose.bind(this));
        ApiClient.on("ready",this.onReady.bind(this));

        this.props.dispatch({ type: "ACCOUNT_FETCH_STARTED" });

        ApiClient.request("user","getAccount",{},(err,res) => {

            if(err != null){
                this.props.dispatch({ type: "ACCOUNT_FETCH_FAILED" , payload: err });
            }else{
                this.props.dispatch({ type: "ACCOUNT_FETCH_SUCCEEDED" , payload: res });
                this.props.dispatch({
                    type: "CONNECTION_READY"
                })
            }

        });


         this.trackRequest = ApiClient.request("tracks","streamAll",{},(err,event) => {
            if (err != null) {
                return console.error(err)
            }

            if (event.type == "value") {

                this.props.dispatch({
                    type: "MANAGE_TRACKS_VALUE",
                    payload: event.value
                })
            }else if(event.type == "initial"){
                console.log(event.values);
                this.props.dispatch({
                    type: "MANAGE_TRACKS_INITIAL_VALUES",
                    payload: event.values
                });

            }else{
                this.props.dispatch({
                    type: "MANAGE_TRACKS_REMOVED",
                    payload: event.id
                });
            }

        });


        this.testScenarioRequest = ApiClient.request("testScenarios","streamAll",{},(err,event) => {
            if(err != null){ return console.error(err) }

            if(event.type == "value"){
                this.props.dispatch({
                    type: "MANAGE_SCENARIOS_VALUE",
                    payload: {
                        id: event.id,
                        value: event.value
                    }
                })
            }else if(event.type == "initial"){

                this.props.dispatch({
                    type: "MANAGE_SCENARIOS_INITIAL_VALUES",
                    payload: event.values
                });

            }else{
                this.props.dispatch({
                    type: "MANAGE_SCENARIOS_REMOVED",
                    payload: event.id
                });
            }

        });
    }




    onClose(){

        this.props.dispatch({
            type: "CONNECTION_ERROR"
        })

    }

    onReady(){
        this.props.dispatch({
            type: "CONNECTION_READY"
        })
    }

    handleError(err){
        console.log(err);
        if(err.errorCode == "notLoggedIn"){
            console.log("Redirect to login");
            browserHistory.push("/login");

            this.props.dispatch({ type: "ACCOUNT_LOGGED_OUT" });
        }

    }

    toggleDrawer(newState){
        this.props.dispatch({
            type: "ACCOUNT_DRAWER_TOGGLE",
            payload: newState
        })
    }

    changeRoute(route){
        browserHistory.replace(route);
    }



    handleSnackbarClose(){
        this.props.dispatch({
            type: "SNACKBAR_HIDE"
        })

    }

    handleSnackbarAction(){
        let {snackbar} = this.props;
        this.props.dispatch({
            type: "SNACKBAR_CLICK",
            payload: snackbar.get("action")
        })

    }

    render(){
        let { account, connection, snackbar } = this.props;

        let routes = [
            { text: "Scenarios", path: "/manage-scenarios", icon: <ViewArray/> },
            { text: "Tracks",path: "/manage-tracks", icon: <PlaylistAdd/> },
        ];


        const activeStyle = {
            backgroundColor: "rgba(0,0,0,.3)"
        };



        return(

            <div>

                <Dialog title="Connecting to server" open={!connection.get("connected")}>
                    <CircularProgress style={{float: "right", marginRight: "3rem", marginBottom: "2rem"}} />
                    <p>Please wait while the connection is being established</p>
                </Dialog>

                <AppBar onLeftIconButtonTouchTap={this.toggleDrawer.bind(this,null)} title="ClickR Admin" iconElementRight={
                    <Avatar  color="#fff" src={ account.get("avatar") } />
                } />
                <Drawer docked={false} onRequestChange={this.toggleDrawer.bind(this)} open={account.get("drawer")}>
                    <CardMedia overlay={
                        <CardTitle title={account.get("fullName")} subtitle={account.get("username")} />
                    }>
                        <img src="https://hd.unsplash.com/photo-1420161900862-9a86fa1f5c79" />
                    </CardMedia>
                    <List>
                        {
                            routes.map((item) => {
                                return(
                                    <ListItem
                                        primaryText={item.text}
                                        key={item.text}
                                        onClick={this.changeRoute.bind(this,item.path)}
                                        leftIcon={item.icon}
                                        style={item.path == this.props.location.pathname ? activeStyle : null}
                                    />
                                );
                            })
                        }
                    </List>
                </Drawer>
                { this.props.children }
                <Snackbar
                    open={snackbar.get("show")}
                    message={snackbar.get("message")}
                    autoHideDuration={snackbar.get("timeout")}
                    onRequestClose={this.handleSnackbarClose.bind(this)}
                    action={snackbar.get("action")}
                    onActionTouchTap={this.handleSnackbarAction.bind(this)}
                />
            </div>
        )
    }

}


export default App