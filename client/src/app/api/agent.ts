import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true; // apart from the allowcredentials() in the api Program() we need this here in the client application to receive and set the cookies

const sleep = ()=> new Promise(resolve=> setTimeout(resolve, 400))

// I am creating a helper method to extract data 
const responseBody = (response: AxiosResponse) => response.data;

// to send up the token with the requests
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})


// using interceptors, on the way back from the api or on the way to it. Below I am using the response
// thus what comes back from the server.  
axios.interceptors.response.use(async response =>{
    if(import.meta.env.DEV) await sleep(); // this is to run a fake delay only if we're in development environment
    const pagination = response.headers['pagination']; // needs to be in lowerCase even if in the browser is not
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response; // after setting this I will move to the catalog slice to add a new piece of state to store the metadata
    }
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
// in the get request I am sending up also a query string with the product parameters. the URLSearchParams needs to be the interface one
const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body:object) => axios.post(url, body).then(responseBody),
    put: (url: string, body:object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

// instantiating an obj to store requests for the catalog
// then in list I will take the params as parameters as well
const Catalog ={
    list: (params: URLSearchParams)=> requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
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

const Account = {
    login: (values:any) => requests.post('account/login', values),
    register: (values:any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress') // when we go to the checkout page we want to know if the user has a saved address
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const Payments = {
    createPaymentIntent: () => requests.post('payments', {})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments
}

export default agent

// what this all achieves is centralizing our requests to DRY code
// Here in this file I call agent is where I have the axios(instead of the fetch() by the way...)