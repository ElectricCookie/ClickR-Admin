import Chip from "material-ui/Chip";
import { BaseUrl } from "./ApiClient";
import {connect} from "react-redux";
import UserAvatar from "./userAvatar";

@connect((state ) => {
    return {
        manageTracks: state.manageTracks
    }
})
export default class TrackChip extends React.Component{




    render(){

        let {manageTracks} = this.props;

        console.log(this.props);

        let track = manageTracks.get("items").get(this.props.id);

        console.log(track);

        if(track == null){
            return <div/>;
        }


        return(
            <Chip
                onClick={this.props.onClick}>
                <UserAvatar userId={track.get("ownerId")} />
                {track.get("title")}
            </Chip>
        )
    }

}