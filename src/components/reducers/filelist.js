export default function filelist(state = [], action) {
    switch (action.type) {

      case 'LOAD_SUCCESS':
      //console.log(action.data)
        return [...action.data]
        

      default:
        return state;
    }
  
  
}
  