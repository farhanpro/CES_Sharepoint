import * as React from 'react';
//import styles from './Ces.module.scss';
import type { ICesProps } from './ICesProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import { Icon, PrimaryButton, 
   Stack,
   DetailsList,
  IColumn, 
  DetailsListLayoutMode} from '@fluentui/react';
import styles from './Ces.module.scss';
import { ICesState } from './ICesStates';
import DataServices from '../common/dataservices';
import { FileTypeIcon, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";

//import { getFileTypeIconProps, FileIconType } from '@fluentui/react-file-type-icons';

// import {Moment} from 'moment';
//import { FileTypeIcon, ApplicationType, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";
//import { IDocumentLibraryInformation } from "@pnp/sp/sites";
//import { Moment } from 'moment';



let sp: SPFI;
let commonService: any = null;

export default class Ces extends React.Component<ICesProps, ICesState> {
//   private _columns: IColumn[] = [
//     {key:'FilessType',name:'File Type',fieldName:'FileType',minWidth:100,maxWidth:200,isResizable:true},
//     {key:'Title',name:'Title',fieldName:'Title',minWidth:100,maxWidth:200,isResizable:true},
//     {key:'ModifiedBy',name:'Modified By',fieldName:'ModifiedBy',minWidth:100,maxWidth:200,isResizable:true},
//     {key:'ModifiedOn',name:'Modified On',fieldName:'ModifiedOn',minWidth:100,maxWidth:200,isResizable:true},
// ]
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
    console.log("Sp installed",sp);
    commonService = new DataServices(this.props.spcontext);
  }

 
  
 async componentDidMount(): Promise<void> {

  const data: { Name: any;Modified:any; ModifiedBy: any; FileType: string;FileRed:string;FileLeafRef:string; }[] = [];
    //const web = Web(this.props.webURL);
    try {
      // get documents using pnp js web
      const internalTraning = await commonService.getItems();
      console.log(internalTraning);
  
      // Mapping data
      internalTraning.map((element:any) => {
        // Extract file extension from the file name
        const fileName = element.File.Name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
  
        // Determine file type based on file extension
        let fileType = 'Unknown';
        if (fileExtension === 'pdf') {
          fileType = 'PDF';
        } else if (['xls', 'xlsx'].indexOf(fileExtension)) {
          fileType = 'xls';
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
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy:element.Editor.Title,
          FileType: fileType,
          ModifiedOn:element.Modified,
          CesArr:[...this.state.CesArr,
            {
              ID: element.ID,
          Title: fileName,
          FileType: fileType,
          ModifiedBy:element.Editor.Title,
          ModifiedOn:element.Modified,
            }]
        });
      });
  
      console.log("Ye DAta hai",data);
      console.log("Ye state hai",this.state.CesArr);
  
     
    } catch (error) {
      console.log(error);
    }
  }
  private renderFileTypeIcon = (item: any, index: number, column: IColumn): JSX.Element => {

    
    const fileTypeIconProps = ({
      type: IconType.image, // Change to IconType.image for image file icons
      path: item.FileType, // Use file extension or full path depending on your requirement
      size: ImageSize.small,
    });
  
    return <FileTypeIcon {...fileTypeIconProps} />;
  }
  public render(): React.ReactElement<ICesProps> {
    

    return (
    <Stack>
    
    <Stack className={styles.headingRow}>
      <h4>Internal traning</h4>

      <Stack style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignContent:"space-evenly",width:"40px"}}>
      <Icon
              iconName="CloudUpload"
              aria-label="Add Online Event Icon"
              style={{ fontSize: "20px" , color:"#646E81", }}
            />
            <span>Drag and drop files here</span>
      </Stack>

            <PrimaryButton style={{width:"132px",height:"32px",borderRadius:"4px"}}>Create folder</PrimaryButton>
            <p>see all</p>
    </Stack>
      <Stack>
      <DetailsList 
          items={this.state.CesArr}
          columns={[
            { key: 'FileType', name: 'File Type', fieldName: 'FileType', minWidth: 100, maxWidth: 200, isResizable: true, onRender: this.renderFileTypeIcon },
            { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
            { key: 'ModifiedBy', name: 'Modified By', fieldName: 'ModifiedBy', minWidth: 100, maxWidth: 200, isResizable: true },
            { key: 'ModifiedOn', name: 'Modified On', fieldName: 'ModifiedOn', minWidth: 100, maxWidth: 200, isResizable: true },
          ]}
          setKey='set'
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
         
        />
        <p>Total {this.state.CesArr.length}</p>
      </Stack>
    </Stack>
    );
  }
}


