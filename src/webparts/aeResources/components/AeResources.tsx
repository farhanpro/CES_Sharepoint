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
import * as moment from 'moment';

let sp: SPFI;
let commonService: any = null;

export default class AeResources extends React.Component<IAeResourcesProps,IAeResourcesState> {
  constructor(props:any){
    super(props);
    this.state = {
      ID:"",
      Title:"",
      FileType:"",
      ModifiedBy:"",
      ModifiedOn:"",
      CesArr:[],
      CPArr:[],
      CTInfoArr:[],

    }
    sp = spfi().using(SPFx(this.props.spcontext));
    console.log("Sp installed",sp);
    commonService = new DataServices(this.props.spcontext);
  }

  async componentDidMount(): Promise<void> {
   // const data: { Name: any;Modified:any; ModifiedBy: any; FileType: string;FileRed:string;FileLeafRef:string; }[] = [];
    try {
      // get documents using pnp js web
      const aeResources = await commonService.getItems('AE Resources');
      console.log(aeResources);

      // Mapping data
    await  aeResources.map((element:any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy:element.Editor.Title,
          FileType: "",
          ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
          CesArr:[...this.state.CesArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy:element.Editor.Title,
              ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
            }]
        });
      });

      // CP Resources 
      const cpResources = await commonService.getItems('Customer Presentation');
      console.log("CP Resources..",cpResources);

      await cpResources.map((element:any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy:element.Editor.Title,
          FileType: "",
          ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
          CPArr:[...this.state.CPArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy:element.Editor.Title,
              ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
            }]
        });
      })

      //Competitive Information
      const ctInfo = await commonService.getItems('Competitive Information');
      console.log("Competitive Information..", ctInfo);
      await ctInfo.map((element:any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy:element.Editor.Title,
          FileType: "",
          ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
          CTInfoArr:[...this.state.CTInfoArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy:element.Editor.Title,
              ModifiedOn:moment(element.Modified).format("DD-MM-YYYY"),
            }]
        });
      })
    

    } catch (error) {
      console.log(error);
    }
  }

  private renderFileTypeIcon = (item: any, index: number, column: IColumn): JSX.Element => {
    const fileTypeIconProps = {
      type: IconType.image,
      path: item.Title,
      size: ImageSize.small,
    };

    return <FileTypeIcon {...fileTypeIconProps} />;
  }

  public render(): React.ReactElement<IAeResourcesProps> {
    return (
      <Stack>

      <Stack horizontal style={{marginTop:"15px"}}>

        <Stack  className={styles.tempCss} >
          <Stack className={styles.headingRow}>
            <h4>Ae Resources</h4> <p>see all</p>
          </Stack>
          <DetailsList 
            items={this.state.CesArr}
            columns={[
              { key: 'FileType', name: 'File Type', fieldName: 'FileType', minWidth: 10, maxWidth: 50, isResizable: true, onRender: this.renderFileTypeIcon },
              { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedOn', name: 'Modified On', fieldName: 'ModifiedOn', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedBy', name: 'Modified By', fieldName: 'ModifiedBy', minWidth: 50, maxWidth: 100, isResizable: true },
              
            ]}
            setKey='set'
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
          />
          <p>Total {this.state.CesArr.length}</p>
        </Stack>

        <Stack className={styles.tempCss} style={{marginLeft:"15px"}}>
          <Stack className={styles.headingRow}>
          <h4>Customer Presentations</h4> <p>see all</p>
          </Stack>
          <DetailsList 
            items={this.state.CPArr}
            columns={[
              { key: 'FileType', name: 'File Type', fieldName: 'FileType', minWidth: 10, maxWidth: 50, isResizable: true, onRender: this.renderFileTypeIcon },
              { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedBy', name: 'Modified By', fieldName: 'ModifiedBy', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedOn', name: 'Modified On', fieldName: 'ModifiedOn', minWidth: 50, maxWidth: 100, isResizable: true },
            ]}
            setKey='set'
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
          />
          <p>Total {this.state.CesArr.length}</p>
        </Stack>

     </Stack>

     <Stack horizontal style={{marginTop:"15px"}}>

        <Stack  className={styles.tempCss}  >
          <Stack className={styles.headingRow}>
          <h4>Ae Resources</h4> <p>see all</p>
          </Stack>
          <DetailsList 
            items={this.state.CesArr}
            columns={[
              { key: 'FileType', name: 'File Type', fieldName: 'FileType', minWidth: 10, maxWidth: 50, isResizable: true, onRender: this.renderFileTypeIcon },
              { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedOn', name: 'Modified On', fieldName: 'ModifiedOn', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedBy', name: 'Modified By', fieldName: 'ModifiedBy', minWidth: 50, maxWidth: 100, isResizable: true },
              
            ]}
            setKey='set'
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
          />
          <p>Total {this.state.CesArr.length}</p>
        </Stack>

        <Stack className={styles.tempCss} style={{marginLeft:"15px"}}  >
          <Stack className={styles.headingRow}>
            <h4>Competitive Information</h4> <p>see all</p>
          </Stack>
          <DetailsList 
            items={this.state.CTInfoArr}
            columns={[
              { key: 'FileType', name: 'File Type', fieldName: 'FileType', minWidth: 10, maxWidth: 50, isResizable: true, onRender: this.renderFileTypeIcon },
              { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedBy', name: 'Modified By', fieldName: 'ModifiedBy', minWidth: 50, maxWidth: 100, isResizable: true },
              { key: 'ModifiedOn', name: 'Modified On', fieldName: 'ModifiedOn', minWidth: 50, maxWidth: 100, isResizable: true },
            ]}
            setKey='set'
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
          />
          <p>Total {this.state.CesArr.length}</p>
        </Stack>

     </Stack>

     </Stack>
    );
  }
}
