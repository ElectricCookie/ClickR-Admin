import { Card, CardHeader, CardText, CardActions } from "material-ui/Card"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import {Link} from "react-router";
import CircularProgress from 'material-ui/CircularProgress';
import Radium from "radium";
import {connect} from "react-redux";
import { browserHistory } from "react-router";
import ApiClient from "./apiClient";
const styles = {
    center: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)"
    }
};

@Radium
@connect((state) => { return { login: state.login }})
export default class Login extends React.Component{


    changeUsername(e){
        this.props.dispatch({
            type: "LOGIN_CHANGE_USERANME",
            payload: e.target.value
        })
    }

    changePassword(e){
        this.props.dispatch({
            type: "LOGIN_CHANGE_PASSWORD",
            payload: e.target.value
        })
    }

    login(e){

        e.preventDefault();

        this.props.dispatch({
           type: "LOGIN_SUBMIT"
        });

        ApiClient.request("user","login",{
            username: this.props.login.get("username"),
            passwordInput: this.props.login.get("password")
        },(err,res) => {
            console.log(err,res);
            if(err != null){
                this.props.dispatch({
                    type: "LOGIN_FAILED",
                    payload: err
                })
            }else{
                browserHistory.push("/");
                this.props.dispatch({
                    type: "LOGIN_SUCCEEDED",
                    payload: res
                })
            }
        })

    }

    render(){

        let {login} = this.props;

        let errorText;
        if(login.get("error") != null){
            let errorCode = login.get("error").get("errorCode");

            if(errorCode == "invalidLogin"){
                errorText = "Username or password wrong";
            }
        }

        return(
            <div className="login-wrapper">
                <div className="login-content">
                    <br/>

                    <form onSubmit={this.login.bind(this)} className="inner">
                        <h1>Login</h1>
                        <CardText>
                            <TextField
                                value={login.get("username")}
                                onChange={this.changeUsername.bind(this)}
                                hintText="Username"
                            />
                            <br/>
                            <TextField
                                value={login.get("password")}
                                onChange={this.changePassword.bind(this)}
                                hintText="Password"
                                errorText={ errorText }
                                type="password"
                            />
                            <br/>
                            {
                                login.get("status") == "pending" ? <CircularProgress style={{ float: "right" }} size={0.3} /> : null
                            }
                        </CardText>
                        <CardActions>
                            <FlatButton containerElement={<Link to="register" /> } type="submit" primary={true} label="Register" />
                            <RaisedButton style={{ verticalAlign: "top" }} type="submit" primary={true} label="Login" />
                        </CardActions>
                    </form>
                </div>
            </div>
        )
    }
}