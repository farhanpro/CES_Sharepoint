import * as React from 'react';
import styles from './CustomerPresentation.module.scss';
import type { ICustomerPresentationProps } from './ICustomerPresentationProps';

import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import { ICompetitiveInformationState } from './ICoustomerPresentation.State';
import DataServices from '../../ces/common/dataservices';
import { FileTypeIcon, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";
import { DetailsList, DetailsListLayoutMode, IColumn,  Stack } from '@fluentui/react';
import * as moment from 'moment';


let sp: SPFI;
let commonService: any = null;
export default class CompetitveInformation extends React.Component<ICustomerPresentationProps, ICompetitiveInformationState> {
  constructor(props:any){
    super(props);
    this.state = {
      ID:"",
      Title:"",
      ModifiedBy:"",
      ModifiedOn:"",
      CiArr:[]
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
        const internalTraning = await commonService.getItems('Customer Presentation');
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
          } 
          else if (['docx', 'dox'].indexOf(fileExtension)) {
            fileType = 'docx';
          }
          else if (['xls', 'xlsx'].indexOf(fileExtension)) {
            fileType = 'xls';
          } else if (['mp4', 'avi', 'mkv'].indexOf(fileExtension)) {
            fileType = 'Video';
          }
          
    
          data.push({
            Name: fileName,
            Modified: element.Modified ,
            ModifiedBy: element.Editor.Title,
            FileType: fileType,
            FileLeafRef: element.FileLeafRef,
            FileRed: element.FileRef,
          });
          this.setState({
            ID: element.ID,
            Title: fileName,
            ModifiedBy:element.Editor.Title,
           
            ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
            CiArr:[...this.state.CiArr,
              {
                ID: element.ID,
            Title: fileName,
            
            ModifiedBy:element.Editor.Title,
            ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
              }]
          });
        });
    
        console.log("Ye DAta hai",data);
        console.log("Ye state hai",this.state.CiArr);
    
       
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
  
  
  
  public render(): React.ReactElement<ICustomerPresentationProps> {
    return (
      <Stack>
      
      <Stack className={styles.headingRow}>
        <h4>Customer Presentation</h4>
  
       
  
             
              <p>see all</p>
      </Stack>
        <Stack>
        <DetailsList 
            items={this.state.CiArr}
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
          <p>Total {this.state.CiArr.length}</p>
        </Stack>
      </Stack>
      );
  }
}
