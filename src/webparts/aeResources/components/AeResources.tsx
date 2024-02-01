import * as React from 'react';
import styles from './AeResources.module.scss';
import type { IAeResourcesProps } from './IAeResourcesProps';
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import { 
  Stack,
  DetailsList,
 IColumn, 
 DetailsListLayoutMode} from '@fluentui/react';
import { IAeResourcesState } from './IAeResources.State';
import DataServices from '../../ces/common/dataservices';
import { FileTypeIcon, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";


let sp: SPFI;
let commonService: any = null;
export default class AeResources extends React.Component<IAeResourcesProps,IAeResourcesState> {
  constructor(props:any){
    super(props);
    this.state = {
    ID:"",
    Title:"",
    ModifiedBy:"",
    ModifiedOn:"",
    CesArr:[]
    }
    sp = spfi().using(SPFx(this.props.spcontext));
    console.log("Sp installed",sp);
    commonService = new DataServices(this.props.spcontext);
  }

  async componentDidMount(): Promise<void> {

    const data: { Name: any;Modified:any; ModifiedBy: any; FileRed:string;FileLeafRef:string; }[] = [];
      //const web = Web(this.props.webURL);
      try {
        // get documents using pnp js web
        const internalTraning = await commonService.getItems('AE Resources');
        console.log(internalTraning);
    
        // Mapping data
        internalTraning.map((element:any) => {
          // Extract file extension from the file name
          const fileName = element.File.Name;
    
          data.push({
            Name: fileName,
            Modified: element.Modified,
            ModifiedBy: element.Editor.Title,
            FileLeafRef: element.FileLeafRef,
            FileRed: element.FileRef,
          });
          this.setState({
            ID: element.ID,
            Title: fileName,
            ModifiedBy:element.Editor.Title,
       
            ModifiedOn:element.Modified,
            CesArr:[...this.state.CesArr,
              {
                ID: element.ID,
            Title: fileName,
        
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
        path: item.Title, // Use file extension or full path depending on your requirement
        size: ImageSize.small,
      });
    
      return <FileTypeIcon {...fileTypeIconProps} />;
    }
  
  public render(): React.ReactElement<IAeResourcesProps> {
    
    return (
      <Stack>
      
      <Stack className={styles.headingRow}>
        <h4>AE Resources</h4>
  
       
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
