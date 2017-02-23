import {List,ListItem} from "material-ui/List";
import TextField from "material-ui/TextField";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from 'material-ui/svg-icons/content/add';
import {connect} from "react-redux";
import ApiClient from "./ApiClient";
import { browserHistory } from "react-router";
import NewTrack from "./newTrack";
import TrackList from "./trackList";
import TrackItem from "./trackItem";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import styles from "./styles";


@connect((state) => {
    return {
        manageTracks: state.manageTracks
    }
})
export default class ManageTracks extends React.Component{



    onDrop(files) {
        console.log('Received files: ', files);
    }

    componentDidMount(){

    }

    showAdd(){

        this.props.dispatch({
            type: "NEW_TRACK_SET_SHOW",
            payload: true
        })

    }

    changeQuery(e){
        this.props.dispatch({
            type: "MANAGE_TRACKS_SET_QUERY",
            payload: e.target.value
        })
    }




    render() {
        let {manageTracks} = this.props;

        console.log(manageTracks.get("items"));

        return(
            <div>
                <NewTrack/>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle text="Manage Tracks" />
                    </ToolbarGroup>
                    <ToolbarGroup style={{ alignItems: "center" }}>
                        <TextField value={manageTracks.get("query")} onChange={this.changeQuery.bind(this)} name="search-input" placeholder="Search..." />
                    </ToolbarGroup>
                </Toolbar>

                <TrackList />

                <FloatingActionButton onClick={this.showAdd.bind(this,true)} secondary={true} style={styles.fab}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )

    }
}