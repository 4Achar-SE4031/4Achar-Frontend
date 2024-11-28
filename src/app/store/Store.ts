import { createContext, useContext } from "react";
import EventStore from "./EventStore.ts";
interface Store {
    // activityStore: ActivityStore;
    eventStore: EventStore;
}

export const store: Store = {
    // activityStore: new ActivityStore(),  
    eventStore: new EventStore()
}

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext(StoreContext);
}