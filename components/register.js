import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton";
import {Link} from "react-router";
import FlatButton from "material-ui/FlatButton";
import LinearProgress from 'material-ui/LinearProgress';
import { connect } from "react-redux";
import layout from "./layout";
import ApiClient from "./apiClient";
import {browserHistory} from "react-router";
import Radium from "radium";

@connect((state) => { return { register: state.register }})
export default class Register extends React.Component{



    changeInput(field,e){
        this.props.dispatch({
            type: "REGISTER_SET_INPUT",
            payload: {
                key: field,
                value: e.target.value
            }
        })
    }

    register(e){
        let { register } = this.props;
        e.preventDefault();

        this.props.dispatch({
            type: "REGISTER_STARTED",
        });

        ApiClient.request("user","register",{
            username: register.get("username"),
            passwordInput: register.get("password"),
            confirmPassword: register.get("confirmPassword"),
            email: register.get("email"),
            fullName: register.get("fullName"),
        },(err,res) => {

            this.props.dispatch({
                type: "REGISTER_DONE",
                payload: {
                    err,
                    res
                }
            });
            if(err == null){
                browserHistory.push("/login");
            }
        })
    }

    render(){
        let { register } = this.props;
        return(
            <div className="login-wrapper">
                <form className="login-content" onSubmit={this.register.bind(this)}>
                    {
                        <LinearProgress mode={ register.get("status") == "pending" ? "indeterminate" : "determinate" } value={0} />
                    }

                    <div className="inner">

                        <h1>Register</h1>

                        <div style={{ padding: "2rem" }}>
                            <TextField
                                onChange={this.changeInput.bind(this,"username")}
                                value={register.get("username")}
                                errorText={register.get("usernameError")}
                                required
                                minLength="2"
                                fullWidth={false} hintText="Username"
                            />
                            <br/>
                            <TextField
                                onChange={this.changeInput.bind(this,"fullName")}
                                value={register.get("fullName")}
                                fullWidth={false}
                                minLength="2"
                                required
                                hintText="Full Name"
                            />
                            <br/>
                            <TextField
                                onChange={this.changeInput.bind(this,"email")}
                                value={register.get("email")}
                                errorText={register.get("emailError")}
                                fullWidth={false}
                                required
                                type="email"
                                hintText="E-Mail Address"
                            />
                            <br/>
                            <TextField
                                onChange={this.changeInput.bind(this,"password")}
                                value={register.get("password")}
                                errorText={register.get("passwordError")}
                                minLength="6"
                                fullWidth={false}
                                type="password"
                                required
                                hintText="Password"
                            />
                            <br/>
                            <TextField
                                onChange={this.changeInput.bind(this,"confirmPassword")}
                                value={register.get("confirmPassword")}
                                fullWidth={false}
                                type="password"
                                minLength="6"
                                required
                                hintText="Confirm Password"
                            />
                            <br/>
                            <br/>
                            <FlatButton containerElement={<Link to="login" /> } type="submit" primary={true} label="Back to Login" />
                            <RaisedButton style={{ verticalAlign: "top" }} type="submit" secondary={true} label="Register" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
};