import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPFI,SPFx,spfi} from "@pnp/sp/presets/all";
import { __metadata } from "tslib";


let sp:SPFI;
export default class DataServices{
    public constructor(context:WebPartContext){
        sp = spfi().using(SPFx(context));
    }

 

    //To get all documents libraries
    public getItems = async (libraryName:string) =>{ 
        try {   
              let temp =   sp.web.lists.getByTitle(libraryName)();
              console.log("Raw data heere",temp)
            return await sp.web.lists.getByTitle(libraryName).items.select('Productgroup','Application','File/Name', 'Modified', 'Editor/Title','FileRef', 'FileLeafRef').expand('File', 'Editor')();
        } catch(error) {
            console.log(error);
        }
    }
    

    // To render File type icons


}