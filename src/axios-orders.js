import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-build-app-b9252-default-rtdb.firebaseio.com/'
});

export default instance;