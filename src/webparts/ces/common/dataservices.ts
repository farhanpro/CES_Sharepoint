import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPFI,SPFx,spfi} from "@pnp/sp/presets/all";

let sp:SPFI;
export default class DataServices{
    public constructor(context:WebPartContext){
        sp = spfi().using(SPFx(context));
    }
    public getItems = async () =>{ 
        try{   
          return  await sp.web.lists.getByTitle('Internal Tranings').items
            .select('File/Name, Modified, Editor/Title', "FileRef","FileLeafRef").expand('File', 'Editor')();
    }
    catch(error){
        console.log(error);
    }
    }
}