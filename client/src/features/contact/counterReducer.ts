export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'


export interface CounterState {
    data: number;
    title: string;
}

// export function increment(amount = 1){
//     return {
//         type: INCREMENT_COUNTER,
//         payload: amount
//     }
// }

// export function decrement(amount = 1){
//     return {
//         type: DECREMENT_COUNTER,
//         payload: amount
//     }
// }

// when we create a reducer we need to give it an initial state

const initialState: CounterState = {
    data: 42,
    title: "YARC (yet another redux counter)"
}

// then our reducer function where we pass as arguments the state and the action
// the action is what we dispatch to our reducer to change the state in some way
export default function counterReducer(state = initialState, action:any){
    return state;
}

