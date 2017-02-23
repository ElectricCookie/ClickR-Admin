import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import ApiClient from "./apiClient";
import {connect} from "react-redux";

@connect((state) => {
    return {
        userChip: state.userChip
    }
})
export default class UserChip extends React.Component{

    static propTypes = {
        userId: React.PropTypes.string.isRequired
    };

    componentWillMount(){
        let { userChip } = this.props;
        let foundUsers = userChip.get("items").filter((item) => {
            return item.get("id") == this.props.userId;
        });

        if(foundUsers.size == 0){

            ApiClient.request("user","getProfile",{ user: this.props.userId },(err,res) => {

                if(err == null){
                    this.props.dispatch({
                        type: "USER_CHIP_USER_LOADED",
                        payload: res
                    });
                }

            })

        }

    }

    render(){

        let { userChip } = this.props;

        let user = userChip.get("items").filter((item) => {
            return item.get("id") == this.props.userId;
        }).get(0);

        if(user == null){
            return <div/>;
        }

        return(
            <Chip style={{margin: 4}} onRequestDelete={this.props.onDelete}>
                <Avatar src={user.get("avatar")} />
                { user.get("fullName") }
            </Chip>
        );
    }

}