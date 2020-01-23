import dummy_user_list from '../data/dummy_user_list.json';
import dummy_group_list from '../data/dummy_group_list.json';
import dummy_group_msgs from '../data/dummy_group_msgs.json';


const Fetch = {
  fetchGroups() {
    //would require a server call to pull this information from our database
    return dummy_group_list

  },
  
  fetchUsers(){
    //would require a server call to pull this information from our database
    return dummy_user_list;
  },
  
  fetchGroupMsgs() {
    //would require a server call to pull this information from our database
    return dummy_group_msgs;
  },
}

export {  Fetch as default }