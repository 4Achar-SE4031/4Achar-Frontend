import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./Store";

class EventStore {


    constructor() {
        makeAutoObservable(this);
    }


}

export default EventStore;
