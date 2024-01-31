import * as React from 'react';
//import styles from './Ces.module.scss';
import type { ICesProps } from './ICesProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import { Icon, PrimaryButton, Stack } from '@fluentui/react';
import styles from './Ces.module.scss';
import { ICesState } from './ICesStates';
// import {Moment} from 'moment';
//import { FileTypeIcon, ApplicationType, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";
//import { IDocumentLibraryInformation } from "@pnp/sp/sites";
//import { Moment } from 'moment';



let sp: SPFI;
export default class Ces extends React.Component<ICesProps, ICesState> {
  constructor(props:any){
    super(props);
    this.state = {
    ID:"",
    Title:"",
    FileType:"",
    ModifiedBy:"",
    ModifiedOn:"",
    CesArr:[]
    }
    sp = spfi().using(SPFx(this.props.spcontext));
    //console.log("Sp installed",sp);
  }

 
  
 async componentDidMount(): Promise<void> {

  const data: { Name: any;Modified:any; ModifiedBy: any; FileType: string;FileRed:string;FileLeafRef:string; }[] = [];
    //const web = Web(this.props.webURL);
    try {
      // get documents using pnp js web
      const internalTraning = await sp.web.lists.getByTitle('Internal Tranings').items.select('File/Name, Modified, Editor/Title', "FileRef","FileLeafRef").expand('File', 'Editor')();
      console.log(internalTraning);
  
      // Mapping data
      internalTraning.map(element => {
        // Extract file extension from the file name
        const fileName = element.File.Name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
  
        // Determine file type based on file extension
        let fileType = 'Unknown';
        if (fileExtension === 'pdf') {
          fileType = 'PDF';
        } else if (['xls', 'xlsx'].indexOf(fileExtension)) {
          fileType = 'Excel';
        } else if (['mp4', 'avi', 'mkv'].indexOf(fileExtension)) {
          fileType = 'Video';
        }
        
  
        data.push({
          Name: fileName,
          Modified: element.Modified,
          ModifiedBy: element.Editor.Title,
          FileType: fileType,
          FileLeafRef: element.FileLeafRef,
          FileRed: element.FileRef,
        });
      });
  
      console.log(data);
  
     
    } catch (error) {
      console.log(error);
    }
  }
  
  public render(): React.ReactElement<ICesProps> {
    

    return (
    <Stack>
    
    <Stack className={styles.headingRow}>
      <h2>Internal Tranings</h2>

      <Stack style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignContent:"center"}}>
      <Icon
              iconName="CloudUpload"
              aria-label="Add Online Event Icon"
              style={{ fontSize: "20px" , color:"#646E81", }}
            />
            <span>Drag and drop files here</span>
      </Stack>

            <PrimaryButton style={{width:"90px",height:"16px",font: "normal normal bold 12px/20px Segoe UI"}}>Create folder</PrimaryButton>
            <p>see all</p>
    </Stack>
    
    </Stack>
    );
  }
}


