import {connect} from "react-redux";
import AutoComplete from "material-ui/AutoComplete";
import ApiClient from "./apiClient";
@connect((state) => {
    return {
        searchUser: state.searchUser
    }
})
export default class SearchUser extends React.Component{


    debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    constructor(){
        super();
        this.callApi = this.debounce(this.loadSuggestions,500)
    }


    loadSuggestions(){
        ApiClient.request("user","search",{
            query: this.props.searchUser.get("query")
        },(err,res) => {

            if(err == null){

                this.props.dispatch({
                    type: "SEARCH_USER_SET_SUGGESTIONS",
                    payload: res.items
                })

            }
        })
    }


    updateInput(searchText){
        console.log(searchText);

        this.callApi(searchText);

        this.props.dispatch({
            type: "SEARCH_USER_SET_QUERY",
            payload: searchText
        })

    }

    userSelected(chosenRequest,index){
        if(index != -1){
            this.props.onSelect(chosenRequest.value);
        }
    }

    render(){
        let { searchUser } = this.props;
        return(
            <AutoComplete
                name="search-user"
                dataSource={searchUser.get("items")}
                value={searchUser.get("query")}
                fullWidth={true}
                floatingLabelText="Search for a user"
                onNewRequest={this.userSelected.bind(this)}
                onUpdateInput={this.updateInput.bind(this)}
            />
        );

    }

}