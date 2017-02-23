import {ListItem} from "material-ui/List";
import { BaseUrl } from "./ApiClient";
import {connect} from "react-redux";
import UserAvatar from "./userAvatar";

@connect((state ) => {
    return {
        manageTracks: state.manageTracks
    }
})
export default class TrackItem extends React.Component{




    render(){

        let {manageTracks} = this.props;

        console.log(this.props);

        let track = manageTracks.get("items").get(this.props.id);

        console.log(track);

        if(track == null){
            return <div/>;
        }


        return(
            <ListItem
                onClick={this.props.onClick}
                primaryText={track.get("title")}
                secondaryText={track.get("description")}
                rightIconButton={this.props.menu}
                leftAvatar={<UserAvatar userId={track.get("ownerId")} />}>
            </ListItem>
        )
    }

}