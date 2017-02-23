import { Card, CardHeader, CardActions , CardText } from "material-ui/Card"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import {List, ListItem} from 'material-ui/List';
import Radium from "radium";
import ApiClient from "./apiClient";
import { connect } from "react-redux";
import { Tabs, Tab } from "material-ui/Tabs";

const styles = {
    container: {

        padding: "15px",
        marginLeft: "auto",
        marginRight: "auto",
        '@media (minWidth: 1200px)': {
            width: "1170px"
        },
        '@media (minWidth: 992px)': {
            width: "970px"
        },
        '@media (minWidth: 768px)': {
            width: "750px"
        }

    }
};

@Radium
@connect((state) => {
    return {}

})
export default class Home extends React.Component{






    render(){
        return <div>
            <Tabs>
                <Tab label="Coupled Scenarios">

                </Tab>
                <Tab label="Test Scenarios">
                    <div style={styles.container}>


                    </div>

                </Tab>
                <Tab label="Tracks"></Tab>
                <Tab label="Users"></Tab>
            </Tabs>
        </div>
    }

}