import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPFI,SPFx,spfi} from "@pnp/sp/presets/all";
import {
    FileTypeIcon,
    IconType,
    ImageSize,
  } from "@pnp/spfx-controls-react/lib/FileTypeIcon";

let sp:SPFI;
export default class DataServices{
    public constructor(context:WebPartContext){
        sp = spfi().using(SPFx(context));
    }

    //To get all documents libraries
    public getItems = async (libraryName:string) =>{ 
        try{   
          return  await sp.web.lists.getByTitle(libraryName).items
            .select('File/Name, Modified, Editor/Title', "FileRef","FileLeafRef").expand('File', 'Editor')();
    }
    catch(error){
        console.log(error);
    }
    }

    // To render File type icons


}