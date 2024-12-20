import axios from'axios';


export function requestTest(){
  axios.get('https://www.baidu.com')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
}
