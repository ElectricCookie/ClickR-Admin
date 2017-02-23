import TrackItem from "./trackItem";
import {List} from "material-ui/List";
import Fuse from "fuse.js";
import {browserHistory} from "react-router";
import {connect} from "react-redux";


@connect((state) => {
    return {
        manageTracks: state.manageTracks
    }
})
export default class TrackList extends React.Component{



    onClickItem(id){
        if(this.props.onClick != null) {
            this.props.onClick(id)
        }else{
            browserHistory.push("/edit-track/"+id)
        }
    }


    render(){

        let { manageTracks } = this.props;

        let fuse = new Fuse(manageTracks.get("items").toList().toJS(),{
            keys: ["title","description"],
            id: "id"
        });

        let results;

        let query = manageTracks.get("query");

        if(query.length != 0){
            results = fuse.search(manageTracks.get("query"))
        }else{
            results = manageTracks.get("items").toList().toJS().map((item) => { return item.id });
        }


        return <List>
            {
                results.map((item) => {
                    console.log(item);
                    return <TrackItem
                        id={item}
                        onClick={this.onClickItem.bind(this,item)}
                        key={item}
                    />
                })
            }
        </List>
    }

}