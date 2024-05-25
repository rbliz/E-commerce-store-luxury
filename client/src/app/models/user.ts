import { Basket } from "./basket";

export interface User{
    email: string;
    token: string;
    basket?: Basket;
    roles?: string[]
}

// when we login we'll extract the roles from the token and store it here in the roles
// this will help us to have some functionalities and views only for specific roles, in my case for the admin