import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true; // apart from the allowcredentials() in the api Program() we need this here in the client application to receive and set the cookies

const sleep = ()=> new Promise(resolve=> setTimeout(resolve, 400))

// I am creating a helper method to extract data 
const responseBody = (response: AxiosResponse) => response.data;

// using interceptors, on the way back from the api or on the way to it. Below I am using the response
// thus what comes back from the server.  
axios.interceptors.response.use(async response =>{
    await sleep();
    return response
}, (error: AxiosError)=>{
    // checking the status of the error to display a toast in the UI depending on which type of error
    const {data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            // this is for the validation error that is a 400 error as well
            if(data.errors){
                const modelStateErros: string[] = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErros.push(data.errors[key]);
                    }
                }
                throw modelStateErros.flat(); // this concatenates the elements into a new array
            }
            toast.error(data.title);
                break;
        case 401:
            toast.error(data.title);
                break;
        case 500:
            router.navigate('/server-error', {state: {error: data}}) // passing data to the state of the route we're navigating to. Then use a react hook called useLocation()                
            break;
        default:
            break;
    }
    return Promise.reject(error.response); // Always return the error
})

// instantiating  an obj for the different types of requests
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body:object) => axios.post(url, body).then(responseBody),
    put: (url: string, body:object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

// instantiating an obj to store requests for the catalog
const Catalog ={
    list: ()=> requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

// instantiating an obj to test errors
const TestErrors = {
    get400error: () => requests.get('buggy/bad-request'),
    get401error: () => requests.get('buggy/unauthorized'),
    get404error: () => requests.get('buggy/not-found'),
    get500error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

// instantiating an obj to store requests for the basket
const Basket = {
    get: () => requests.get('basket'), // the url of our basket controller 'basket'
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}), // even though we're not sending any data in the body because we're using query strings we need to put the empty obj {}
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent

// what this all achieves is centralizing our requests to DRY code
// Here in this file I call agent is where I have the axios(instead of the fetch() by the way...)