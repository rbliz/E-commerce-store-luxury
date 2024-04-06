

// creating this as the first step to deal with the pagination via the response headers that we get whose logic is specifyied in the agent.ts file

// inside here we want to match the properties that we're getting from the API. The names must be exactly what equal
// to the ones we see in the Network 

export interface MetaData{
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

// in the class we need to specify the values, whereas in the interface we only specify the type
export class PaginatedResponse<T> {
    items: T;
    metaData: MetaData;

   // when we create an instance of the paginatedResponse these values are passing in
    constructor(items: T, metaData: MetaData) {
     
        this.items = items, // asigning the value passed as parameter to the property of the class
        this.metaData = metaData
    }
}

// after setting this we'll move the agent.ts file