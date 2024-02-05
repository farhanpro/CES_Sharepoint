import * as React from 'react';
//import styles from './CesPresales.module.scss';
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import type { ICesPresalesProps } from './ICesPresalesProps';
import DataServices from '../../ces/common/dataservices';
import {  Stack } from '@fluentui/react';

import { ICesState } from './ICesPreSales.state';
// import { FileTypeIcon, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";
import * as moment from 'moment';


let sp: SPFI;
let commonService: any = null;
export default class CesPresales extends React.Component<ICesPresalesProps,ICesState> {
  constructor(props: any) {
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
    console.log("commonService installed", commonService);
  }
  async componentDidMount(): Promise<void> {

    const data: { Name: any;Modified:any; ModifiedBy: any; FileRed:string;FileLeafRef:string; }[] = [];
      //const web = Web(this.props.webURL);
      try {
        // get documents using pnp js web
        const internalTraning = await commonService.getItems('Internal Tranings');
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
           
            ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
            CesArr:[...this.state.CesArr,
              {
                ID: element.ID,
            Title: fileName,
            
            ModifiedBy:element.Editor.Title,
            ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
              }]
          });
        });
    
        console.log("Ye DAta hai",data);
        console.log("Ye state hai",this.state.CesArr);
    
       
      } catch (error) {
        console.log(error);
      }
    }
    // private renderFileTypeIcon = (item: any, index: number, column: IColumn): JSX.Element => {
  
      
    //   const fileTypeIconProps = ({
    //     type: IconType.image, // Change to IconType.image for image file icons
    //     path: item.Title, // Use file extension or full path depending on your requirement
    //     size: ImageSize.small,
    //   });
    
    //   return <FileTypeIcon {...fileTypeIconProps} />;
    // }
  public render(): React.ReactElement<ICesPresalesProps> {
    return (
      <Stack>

    

      </Stack>
    );
  }
}
