import { makeAutoObservable, runInAction } from "mobx";
// import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
// import { format } from "date-fns";
import { store } from "./Store";

class EventStore {
    showType: string;
    //   activityRegistry = new Map<string, Activity>();
    //   selectedActivity: Activity | undefined = undefined;
    //   editMode = false;
    //   loading = false;
    //   loadingInitial = false;
    //   pagination: Pagination | null = null;
    //   pagingParams = new PagingParams();



    constructor() {
        makeAutoObservable(this);
    }




    setEventType = (type: string) => {
        runInAction(() => {
            this.showType = type;
            console.log(this.showType)
        })
    }
    get eventType() {
        return this.showType
    }
    loadEvents = async () => {
        // this.setLoadingInitial(true);
        // try {
        //   const result = await agent.Activities.list(this.axiosParams);
        //   result.data.forEach((activity) => {
        //     this.setActivity(activity);
        //   });
        //   this.setPagination(result.pagination);
        // } catch (error) {
        //   console.log(error);
        // } finally {
        //   this.setLoadingInitial(false);
        // }
    };


    loadEvent = async (id: string) => {
        //     let activity = this.getActivity(id);
        //     if (activity) {
        //       this.selectedActivity = activity;
        //       return activity;
        //     } else {
        //       this.setLoadingInitial(true);
        //       try {
        //         activity = await agent.Activities.details(id);
        //         this.setActivity(activity);
        //         runInAction(() => {
        //           this.selectedActivity = activity;
        //         });
        //         this.setLoadingInitial(false);
        //         return activity;
        //       } catch (error) {
        //         console.log(error);
        //         this.setLoadingInitial(false);
        //       }
        //     }
        //   };

    }
}

export default EventStore;
