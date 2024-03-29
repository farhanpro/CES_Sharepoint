import * as React from "react";
import styles from "./AeResources.module.scss";
import type { IAeResourcesProps } from "./IAeResourcesProps";
import { SPFI, SPFx, spfi } from "@pnp/sp/presets/all";
import {
  Stack,
  DetailsList,
  IColumn,
  DetailsListLayoutMode,
  PrimaryButton,
  Text,
  Icon,
  Modal,
  CheckboxVisibility,
  DefaultButton,
  IconButton,
  StackItem,
  TextField,
  SearchBox,
  Checkbox,
  mergeStyles
  
  // IStackTokens,

} from "@fluentui/react";
import { IAeResourcesState } from "./IAeResources.State";
import DataServices from "../../ces/common/dataservices";
import {
  FileTypeIcon,
  IconType,
  ImageSize,
} from "@pnp/spfx-controls-react/lib/FileTypeIcon";    
import Dropzone from "react-dropzone";
import * as moment from "moment";
import Constants from "../../ces/common/constants";
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';

let sp: SPFI;
let commonService: any = null;
// let items: any = null;
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width:180 ,borderRadius:4},
};

let options: IDropdownOption[] = [];
let selectedPRoductkey = '';
let selectedApplicationkey = '';
options = [
  { key: 'All', text: 'All' },
  { key: 'Type A', text: 'Type A' },
  { key: 'Type B', text: 'Type B' },
];

let libraries : IDropdownOption[] = [];
libraries =[{key:Constants.LIST_NAMES.AE_RESOURCES,text:Constants.LIST_NAMES.AE_RESOURCES},
            {key:Constants.LIST_NAMES.CUSTOMER_PRESENTATION,text:Constants.LIST_NAMES.CUSTOMER_PRESENTATION},
            {key:Constants.LIST_NAMES.COMPETITIVE_INFORMATION,text:Constants.LIST_NAMES.COMPETITIVE_INFORMATION},
            {key:Constants.LIST_NAMES.INTERNAL_TRANINGS,text:Constants.LIST_NAMES.INTERNAL_TRANINGS}
          ]
//let appOptions :  IDropdownOption[] = [];

// const stackTokens: IStackTokens = { childrenGap: 20 };
let fileType : IDropdownOption[]=[{key:"All",text:"All"}];

export default class AeResources extends React.Component<
  IAeResourcesProps,
  IAeResourcesState
> {
  onDrop: (files: any) => void;
  constructor(props: any) {
    super(props);
    this.state = {
      ID: "",
      Title: "",
      Image:null,
      FileType: "",
      ModifiedBy: "",
      ModifiedOn: "",
      IsAdd:false,
      productGroup:"",
      application:"",
      selectedkeyApp:"",
      createFolderPopUp:false,
      folderName:"",
      searchValue:"",
      selectedDocLib:"",
      selectedProductGroup:"",
      selectedApplication:"",
      
      titleError: "",
      fileError : "",
      dialogMessage : "",
      isDialogVisible : false,
      bgError : "",
      uploadedFileName : "",
      uploadedFileError:"",
      file :[],
      fieldId : "",
      uploadedFile : [],
      itemId: 0,
      errorMessage : "",
      
      selectedItem:[],
      CesArr: [],
      originalDataCesArr:[],
      CPArr: [],
      originalDataCPArr:[],
      CTInfoArr: [],
      originalDataCTInfoArr:[],
      ITArr: [],
      originalDataITArr:[]
    };
    sp = spfi().using(SPFx(this.props.spcontext));
    //console.log("Sp installed", sp);
   

    this.onDrop = (files) => {
      this.setState({ Image: files });
    };

    commonService = new DataServices(this.props.spcontext);
  }

  async componentDidMount(): Promise<void> {  
    // const data: { Name: any;Modified:any; ModifiedBy: any; FileType: string;FileRed:string;FileLeafRef:string; }[] = [];
    try {
      // get documents using pnp js web
      const aeResources = await commonService.getItems(Constants.LIST_NAMES.AE_RESOURCES);
   
      // Mapping data
      // Create an array to store unique product groups
      await aeResources.map((element: any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        this.setState({
          ID: element.Id,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: fileExtention,
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup: element.Productgroup,
          application:element.Application,
          CesArr: [
            ...this.state.CesArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            },
          ],
        });

        this.setState(prevState => ({
          originalDataCesArr: [
            ...prevState.originalDataCesArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            }
          ]
        }));
        
      });
     // console.log("Here are the AE Resources",this.state.CesArr);

   await  aeResources.forEach((element:any) => {
    const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
    const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
    
      // Check if the file extension is not already present in fileType
      const existsIndex = fileExtention=='folder'? "folder":fileType.findIndex((item) => item.key === fileExtention);
      if (existsIndex === -1) {
        fileType.push({ key: fileExtention, text: fileExtention });
      }
    });
    
    

      // CP Resources
      const cpResources = await commonService.getItems(Constants.LIST_NAMES.CUSTOMER_PRESENTATION);
      //console.log("Customer presentation", cpResources);

      await cpResources.map((element: any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        this.setState({
          ID: element.Id,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: fileExtention,
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          CPArr: [
            ...this.state.CPArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });
        this.setState(prevState => ({
          originalDataCPArr: [
            ...prevState.originalDataCPArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            }
          ]
        }));
      });
      await  cpResources.forEach((element:any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        
          // Check if the file extension is not already present in fileType
          const existsIndex = fileExtention=='folder'? "folder":fileType.findIndex((item) => item.key === fileExtention);
          if (existsIndex === -1) {
            fileType.push({ key: fileExtention, text: fileExtention });
          }
        });


      //Competitive Information
      const ctInfo = await commonService.getItems(Constants.LIST_NAMES.COMPETITIVE_INFORMATION);
      //console.log("Competitive Information..", ctInfo);
      await ctInfo.map((element: any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        this.setState({
          ID: element.Id,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: fileExtention,
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          CTInfoArr: [
            ...this.state.CTInfoArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });

        this.setState(prevState => ({
          originalDataCTInfoArr: [
            ...prevState.originalDataCTInfoArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            }
          ]
        }));
      });
      

      await  ctInfo.forEach((element:any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        
          // Check if the file extension is not already present in fileType
          const existsIndex = fileExtention=='folder'? "folder":fileType.findIndex((item) => item.key === fileExtention);
          if (existsIndex === -1) {
            fileType.push({ key: fileExtention, text: fileExtention });
          }
        });

      //Internal tranings
      const it = await commonService.getItems(Constants.LIST_NAMES.INTERNAL_TRANINGS);
      //console.log("Internal Training..", it);
      await it.map((element: any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        this.setState({
          ID: element.Id,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: fileExtention,
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          ITArr: [
            ...this.state.ITArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });

        this.setState(prevState => ({
          originalDataITArr: [
            ...prevState.originalDataITArr,
            {
              ID: element.Id,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            }
          ]
        }));
      });

      await  it.forEach((element:any) => {
        const fileName = element.File && element.File.Name !== undefined ? element.File.Name : element.FileLeafRef;
        const fileExtention = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'folder';
        
          // Check if the file extension is not already present in fileType
          const existsIndex = fileExtention=='folder'? "folder":fileType.findIndex((item) => item.key === fileExtention);
          if (existsIndex === -1) {
            fileType.push({ key: fileExtention, text: fileExtention });
          }
        });

      
    } catch (error) {
      console.log(error);
    }
  }

  private renderFileTypeIcon = (   
    item: any,
    index: number,
    column: IColumn
  ): JSX.Element => {
    if (item && item.FileType && item.FileType === 'folder') {
        // If it's a folder, return the folder icon
        return <Icon iconName="FabricFolderFill" />;
    } else {
        // If it's not a folder, return the regular file icon
        const fileTypeIconProps = {
            type: IconType.image,
            path: item.Title,
            size: ImageSize.small,
        };
        return <FileTypeIcon {...fileTypeIconProps} />;
    }
};

  handleFileDrop = (files: any[]) => {
    const file = files[0];
    this.setState({ file: file, uploadedFileName: file.name });
  };
  public handleFileUpload = async () => {
    const _files = this.state.file;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    if (_files.length === 0) {
        alert("No files were selected.");
        return;
    }

    const _file = _files;

    this.setState({ file: _file, uploadedFileName: _file.name }); 

    const _folderPath = `/sites/FrahanTest/${this.state.selectedDocLib}`;

    if (_file) {
        try {
            const item = await sp.web.getFolderByServerRelativePath(_folderPath).files.addUsingPath(_file.name, _file, { Overwrite: true });
            const itemInfo = await item.file.listItemAllFields();
            const itemId = itemInfo.Id;


            // Update metadata fields
            await sp.web.lists.getByTitle(`${this.state.selectedDocLib}`).items.getById(itemId).update({
                Productgroup: this.state.selectedProductGroup,
                Application: this.state.application
            });

            const imageUrl = item.data.ServerRelativeUrl;

            this.setState({ 
               // fieldId: itemId.toString(),
                uploadedFile: imageUrl,
                IsAdd: false,
                uploadedFileName : "",
                file:"",
                ITArr: []
            });

            this.componentDidMount();
        } catch (error) {
            console.error('Error occurred during file upload:', error);
            // Handle error appropriately
        }
    }

    if (_file.size > maxSizeInBytes) {
        this.setState({ uploadedFileError: "File size exceeds the 10MB limit." });
        return;
    }

    this.setState({ uploadedFileError: "" });
    this.setState({ itemId: _file.itemId });
    this.setState({ uploadedFileName: "" });
};

  Productgroup = async (e: any, selection: any) => {
  
  // console.log("Selection key",selection.key);
  //  console.log("This is CesArr", this.state.CesArr);
  this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]});
 await  this.componentDidMount();
 selectedPRoductkey = selection.key;
 this.setState({selectedkeyApp:selection.key})

 if(selection.key === "All")
 {
  this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
  this.componentDidMount();
  return;
 }
    const filteredArr = this.state.CesArr.reduce((acc: any, item: any) => {if (item.productGroup === selection.key) {acc.push(item);}return acc;}, []);
    const filteredInternalTraningArr = this.state.ITArr.reduce((acc: any, item: any) => {if (item.productGroup === selection.key) {acc.push(item);}return acc;}, []);
    const filteredCPArr = this.state.CPArr.reduce((acc: any, item: any) => {if (item.productGroup === selection.key) {acc.push(item);}return acc;}, []);
    const filteredCTIinfoArr = this.state.CTInfoArr.reduce((acc: any, item: any) => {if (item.productGroup === selection.key) {acc.push(item);}return acc;}, []);

    this.setState({ CesArr: filteredArr,ITArr:filteredInternalTraningArr,CPArr:filteredCPArr,CTInfoArr:filteredCTIinfoArr });
    console.log("Filtered Array", filteredArr);
}

applicationGroup = async (e:any,selection:any) =>{
  selectedApplicationkey = selection.key;
  console.log("Selection application key",selectedApplicationkey);
  if(selection.key === "All")
  {
    this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
    this.componentDidMount();
    return;
  }
  if(selectedPRoductkey == "All")
  {
    const filterAeResources = this.state.CesArr.filter(item => {return  item.application == selection.key;});
    const filterAppIT = this.state.ITArr.filter(item=>{return item.application == selection.key});
    const filterCPArr = this.state.CPArr.filter(item=>{return item.application == selection.key});
    const filterCTArr = this.state.ITArr.filter(item=>{return item.application == selection.key});
  
  this.setState({ CesArr: filterAeResources,ITArr:filterAppIT,CPArr:filterCPArr,CTInfoArr:filterCTArr });
  }
  else{
  this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
  await this.componentDidMount();
  const filterAeResources = this.state.CesArr.filter(item => {return item.productGroup == selectedPRoductkey && item.application == selection.key;});
  const filterAppIT = this.state.ITArr.filter(item=>{return item.productGroup == selectedPRoductkey && item.application == selection.key});
  const filterCPArr = this.state.CPArr.filter(item=>{return item.productGroup == selectedPRoductkey && item.application == selection.key});
  const filterCTArr = this.state.ITArr.filter(item=>{return item.productGroup == selectedPRoductkey && item.application == selection.key});

this.setState({ CesArr: filterAeResources,ITArr:filterAppIT,CPArr:filterCPArr,CTInfoArr:filterCTArr });
  }
}

fileTypeFunction = async (event:any,selection:any) =>{
 
  if(selection.key == "All")
  {
    this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
    await this.componentDidMount();  
  }
  this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
  await this.componentDidMount();
  const filetypeAeResources =  this.state.CesArr.filter(item =>{return   item.FileType == selection.key})
  const filetypeCPResources =  this.state.CPArr.filter(item =>{return item.FileType == selection.key})
  const filetypeCTInfoArr =   this.state.CTInfoArr.filter(item =>{ return  item.FileType == selection.key})
  const filetypeITArr =  this.state.ITArr.filter(item =>{return  item.FileType == selection.key})
  this.setState({CesArr:filetypeAeResources,CPArr:filetypeCPResources,CTInfoArr:filetypeCTInfoArr,ITArr:filetypeITArr});
}


handleInputChange = async (event: any, newValue: string) => {
  if (newValue === '') {
    // if search box is cleared, reset CesArr to originalData
    this.setState({ CesArr: this.state.originalDataCesArr ,CPArr:this.state.originalDataCPArr,CTInfoArr:this.state.originalDataCTInfoArr,ITArr:this.state.originalDataITArr});
  } else {
     const filteredResources =  this.state.originalDataCesArr.filter( resource => 
       resource.Title.toLowerCase().includes(newValue.toLowerCase())
    );
    const filteredCPResources =  this.state.originalDataCPArr.filter( resource => 
      resource.Title.toLowerCase().includes(newValue.toLowerCase())
   );
   const filteredCTResources =  this.state.originalDataCTInfoArr.filter( resource => 
    resource.Title.toLowerCase().includes(newValue.toLowerCase())
 );
   const filteredITRResources =  this.state.originalDataITArr.filter( resource => 
    resource.Title.toLowerCase().includes(newValue.toLowerCase())
 );
    this.setState({ CesArr: filteredResources,CPArr:filteredCPResources,CTInfoArr:filteredCTResources,ITArr:filteredITRResources });
  }
  this.setState({ searchValue: newValue });
}


createFolder = async () =>{
  try {
    // const application= this.state.application;
    // const productGroup = this.state.productGroup;
    // Ensure authentication is done before performing any operation
   // await sp.web.folders.addUsingPath("Internal Tranings/Internal Traningsf");
  const item  =  await sp.web.folders.addUsingPath(`${this.state.selectedDocLib}/${this.state.folderName}`);
    console.log("ITem",item);
    console.log("Folder created successfully");
    this.setState({folderName:"",selectedDocLib:"",createFolderPopUp: false })
  } catch (error) {
    console.log("Error creating folder:", error);
  }
}

onSelectChange = (event:any, item:any) => {
  const { selectedItem } = this.state;
  const index = selectedItem.indexOf(item.key);
  if (index > -1) {
    selectedItem.splice(index, 1);
  } else {
    selectedItem.push(item.key);
  }
  this.setState({ selectedItem });
};
isItemSelected = (key:any) => {
  return this.state.selectedItem.includes(key);
};
renderDropdownItem = (item:any) => {
  return (
    <Stack className={mergeStyles({ display: 'flex',flexDirection:'row', alignItems: 'center' })}>
      <Checkbox
       checked={this.isItemSelected(item.key)}
        onChange={(ev, checked) => this.onSelectChange(ev, item)}
      />
      <span>{item.text}</span>
    </Stack>
  );
};

  public render(): React.ReactElement<IAeResourcesProps> {
    return (
     <section>
        <Stack className={styles.searchbarStack}>
        
        <Stack className={styles.dropdownStack}>
    
      
        <Dropdown
        placeholder="Select"
        label="Product Group"
        options={options}
        styles={dropdownStyles}
        onChange={this.Productgroup}
        disabled={true}
        onRenderOption={this.renderDropdownItem}
      />
        <Dropdown placeholder="Select" label="Applications" 
  options={options}
  styles={dropdownStyles}
 
  onChange={this.applicationGroup}

  onRenderOption={this.renderDropdownItem}
/>
        <Dropdown
  placeholder="Select"
  label="File type"
  options={fileType}
 
  styles={{ 
    dropdown: { 
      width: '200px' // Adjust the width as needed
    },
    ...dropdownStyles // If you have additional styles, spread them here
  }}
  onChange={this.fileTypeFunction}
  onRenderOption={this.renderDropdownItem}
/>
        </Stack>
        
        <Stack style={{paddingTop:"2.5%"}}>
          <SearchBox
  placeholder="Search"
  onChange={this.handleInputChange}
/>

        </Stack>
        
        </Stack>

        <Stack horizontal style={{ marginTop: "15px" }}>
       
     
          <Stack className={styles.tempCss}>
    
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Internal traning</Text>
              <Stack
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "180px",
                }}
              >
                <Icon
                  iconName="CloudUpload"
                  aria-label="Add Online Event Icon"
                  style={{ fontSize: "15px", color: "#646E81" }}
                />
                <DefaultButton style={{backgroundColor:"#FFFFFF", color: "#646E81" ,borderColor:"#FFFFFF",padding:0}} onClick={() => {this.setState({IsAdd:true})}}>Drag and drop files here</DefaultButton>
              </Stack>

              <PrimaryButton
                style={{
                  width: "125px",
                  height: "32px",
                  borderRadius: "1px",
                  backgroundColor: "#5A2A82",
                }}
                onClick={() => {this.setState({createFolderPopUp:true})}}
              >
                Create folder
              </PrimaryButton>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
                <Stack style={{overflowY: 'auto'}}>
            <DetailsList
              items={this.state.ITArr}
              columns={[
                {
                  key: "FileType",
                  name: (
                    <Stack
                      horizontal
                      horizontalAlign="center"
                      
                    >
                     
                      
                        <Icon
                          iconName={"Page"}
                        ></Icon>
                      </Stack>
                    
                  ) as any,
                  fieldName: "FileType",
                  minWidth: 20,
                  maxWidth: 50,
                  isResizable: true,
                  onRender: this.renderFileTypeIcon,
                },
                {
                  key: "Title",
                  name: "Title",
                  fieldName: "Title",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                  onRender:(items)=>{return <Stack> <Text className={styles.insideText}>{items.Title}</Text> <StackItem className={styles.descriptionText}><span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid animi voluptatibus quam earum iusto consequuntur quis quaerat eum quos. Veniam non porro nemo corrupti explicabo, totam ex sequi unde fugit?</span></StackItem></Stack>} 
                },
                {
                  key: "ModifiedOn",
                  name: "Modified On",
                  fieldName: "ModifiedOn",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
                {
                  key: "ModifiedBy",
                  name: "Modified By",
                  fieldName: "ModifiedBy",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
              ]}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selectionPreservedOnEmptyClick={true}
              checkboxVisibility={CheckboxVisibility.hidden}
              
            />
            </Stack>
          </Stack>

 
          <Stack className={styles.tempCss} style={{ marginLeft: "15px" }}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Customer Presentations</Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <Stack  style={{overflowY: 'auto'}}>
            <DetailsList
              items={this.state.CPArr}
             
              columns={[
                {
                  key: "FileType",
                  name: (
                    <Stack
                      horizontal
                      horizontalAlign="center"
                      
                    >
                        <Icon
                          iconName={"Page"}
                        ></Icon>
                      </Stack>
                    
                  ) as any,
                  fieldName: "FileType",
                  minWidth: 20,
                  maxWidth: 50,
                  isResizable: true,
                  onRender: this.renderFileTypeIcon,
                },
                {
                  key: "Title",
                  name: "Title",
                  fieldName: "Title",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                  onRender:(items)=>{return <Stack> <Text className={styles.insideText}>{items.Title}</Text> <StackItem><span className={styles.descriptionText}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid animi voluptatibus quam earum iusto consequuntur quis quaerat eum quos. Veniam non porro nemo corrupti explicabo, totam ex sequi unde fugit?</span></StackItem></Stack>}
                },
                {
                  key: "ModifiedOn",
                  name: "Modified On",
                  fieldName: "ModifiedOn",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
                {
                  key: "ModifiedBy",
                  name: "Modified By",
                  fieldName: "ModifiedBy",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
              ]}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selectionPreservedOnEmptyClick={true}
              checkboxVisibility={CheckboxVisibility.hidden}
            />
            </Stack>
          </Stack>
        </Stack>

        <Stack horizontal style={{ marginTop: "15px" }}>
          <Stack className={styles.tempCss}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Ae Resources</Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <Stack style={{overflowY:"auto"}}>
            <DetailsList
              items={this.state.CesArr}
              columns={[
                {
                  key: "FileType",
                  name: (
                    <Stack
                      horizontal
                      horizontalAlign="center"
                      
                    >
                     
                      
                        <Icon
                          iconName={"Page"}
                        ></Icon>
                      </Stack>
                    
                  ) as any,
                  fieldName: "FileType",
                  minWidth: 20,
                  maxWidth: 50,
                  isResizable: true,
                  onRender: this.renderFileTypeIcon,
                },
                {
                  key: "Title",
                  name: "Title",
                  fieldName: "Title",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                  onRender:(items)=>{return <Stack> <Text className={styles.insideText}>{items.Title}</Text> <StackItem><span className={styles.descriptionText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid animi voluptatibus quam earum iusto consequuntur quis quaerat eum quos. Veniam non porro nemo corrupti explicabo, totam ex sequi unde fugit?</span></StackItem></Stack>}
                },
                {
                  key: "ModifiedOn",
                  name: "Modified On",
                  fieldName: "ModifiedOn",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
                {
                  key: "ModifiedBy",
                  name: "Modified By",
                  fieldName: "ModifiedBy",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
              ]}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selectionPreservedOnEmptyClick={true}
              checkboxVisibility={CheckboxVisibility.hidden}
            />
          </Stack>
          </Stack>

          <Stack className={styles.tempCss} style={{ marginLeft: "15px" }}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>
                Competitive Information
              </Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <Stack style={{overflowY:"auto"}}>
            <DetailsList
              items={this.state.CTInfoArr}
              columns={[
                {
                  key: "FileType",
                  name: (
                    <Stack horizontal horizontalAlign="center">
                     
                      
                        <Icon
                          iconName={"Page"}
                        ></Icon>
                      </Stack>
                    
                  ) as any,
                  fieldName: "FileType",
                  minWidth: 20,
                  maxWidth: 50,
                  isResizable: true,
                  onRender: this.renderFileTypeIcon,
                },
                {
                  key: "Title",
                  name: "Title",
                  fieldName: "Title",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                  onRender:(items)=>{return <Stack> <Text className={styles.insideText}>{items.Title}</Text> <StackItem><span className={styles.descriptionText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid animi voluptatibus quam earum iusto consequuntur quis quaerat eum quos. Veniam non porro nemo corrupti explicabo, totam ex sequi unde fugit?</span></StackItem></Stack>}
                },
                {
                  key: "ModifiedOn",
                  name: "Modified On",
                  fieldName: "ModifiedOn",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
                {
                  key: "ModifiedBy",
                  name: "Modified By",
                  fieldName: "ModifiedBy",
                  minWidth: 50,
                  maxWidth: 100,
                  isResizable: true,
                },
              ]}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
           
              selectionPreservedOnEmptyClick={true}
              checkboxVisibility={CheckboxVisibility.hidden}
            />
          </Stack>
          </Stack>
          
          <Modal 
          isOpen={this.state.IsAdd}
          onDismiss={() => this.setState({ IsAdd: false })}
          isBlocking={false}
            //styles={{ main: { maxWidth: 450 } }}
          styles={{ main: { width: "50%", height: "60%" } }}
          >
            
            <Stack horizontal className={`${styles.headingStyle}`}>
              <Text variant={"xLarge"} className={`${styles.popupHeadingText}`}>
                Add File
              </Text>

              <IconButton
                iconProps={{ iconName: "Cancel" }}
                className={`${styles.cancelBtn}`}
                title="Cancel"
                ariaLabel="Cancel"
                onClick={() => {
                  this.setState({ IsAdd: false });
                }}
                style={{
                  fontSize: "50px",
                  color:"#2E3B4E",
                  opacity: "1",
                  marginRight:"10px",
                  marginTop:"10px"
                  // Adjust spacing as needed
                }}
              />
            </Stack>
                <Stack className={styles.dropZoneCss}>
            <Dropzone onDrop={(files) => this.handleFileDrop(files)}>
                    {({ getRootProps, getInputProps }) => (
                      <Stack className={styles.dragDropFile}>
                        <Stack
                          {...getRootProps({
                            onDrop: (event) => event.stopPropagation()
                          })}
                          className={styles.inputSection}
                        >
                          <input
                            {...getInputProps()}
                            placeholder="No File Chosen"
                            required
                          />
                          <Icon
                            iconName="CloudUpload"
                            style={{
                              fontSize: "38px",
                              color: "#5A2A82",
                              marginBottom: "10px",
                            }}
                          />
                          <p>Drag and drop files here, or click to select files</p>
                          <div>
                          </div>
                          <p>
                            {this.state.uploadedFileName
                              ? ""
                              : this.state.uploadedFileError
                              ? ""
                              : this.state.fileError}
                          </p>
                        </Stack>
                        {this.state.uploadedFileName && (
                          <Stack
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "60px",
                            }}
                          >
                            <Icon
                              iconName="Document"
                              style={{
                                marginRight: "8px",
                                fontSize: "20px",
                                color: "#5A2A82",
                                marginLeft: "10%",
                                marginTop: "5px",
                              }}
                            />
                            <span>{this.state.uploadedFileName}</span>
                          </Stack>
                        )}
                      </Stack>
                    )}
                </Dropzone>
                </Stack>
                <Stack className={styles.modalDropdownStack}>
                <Dropdown
                   placeholder="Select Library"
                 label="Select Library"
                options={libraries}
                  styles={dropdownStyles}
                  required={true}
                  onChange={(e, selection: any) => { this.setState({ selectedDocLib: selection.key }) }}
                />

                <Dropdown
                placeholder="Select Product group"
                label="Product Group"
                options={options}
                required={true}
                onChange={(e,selection:any)=>{this.setState({selectedProductGroup:selection.key})}}
                >
                </Dropdown>
                <Dropdown
                  placeholder="Select Application"
                  label="Label"
                  options={options}
                  required={true}
                  onChange={(e,selection:any)=>{this.setState({selectedApplication:selection.key})}}
                  >

                </Dropdown>

</Stack>

       
                <Stack className={styles.footerContent}>
                <PrimaryButton disabled={this.state.uploadedFileName == "" || this.state.selectedProductGroup == "" || this.state.selectedDocLib == "" || this.state.selectedApplication == "" }  className={`${styles.chooseBtn} ${styles.standardButton}`} onClick={this.handleFileUpload}>
  Upload
</PrimaryButton>

  <PrimaryButton className={`${styles.seeAll} ${styles.standardButton}`} onClick={()=>{this.setState({IsAdd:false})}}>
    Cancel
  </PrimaryButton>
</Stack>

          </Modal>

            <Modal
            isOpen={this.state.createFolderPopUp}
            onDismiss={()=>{this.setState({createFolderPopUp:false})}}
            isBlocking={false}
            styles={{main: { width: "60%", height: "50%" } }}
            >
                <Stack horizontal className={`${styles.headingStyle}`}>
              <Text variant={"xLarge"} className={`${styles.popupHeadingText}`}>
                Add Folder
              </Text>

              <IconButton
                iconProps={{ iconName: "Cancel" }}
                className={`${styles.cancelBtn}`}
                title="Cancel"
                ariaLabel="Cancel"
                onClick={() => {
                  this.setState({ createFolderPopUp: false });
                }}
                style={{
                  fontSize: "50px",
                  color:"#2E3B4E",
                  opacity: "1",
                  marginRight:"10px",
                  marginTop:"10px"
                  // Adjust spacing as needed
                }}
              />
            </Stack>

            <Stack className={styles.dropZoneCss}>
                
                <TextField
                  label="Folder name"
                  placeholder="Folder Name"
                  value={this.state.folderName}
                  onChange={(
                    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                    newValue?: string | undefined
                  ) => this.setState({ folderName: newValue || "" })}
                  required
                />

<Dropdown
                   placeholder="Select Library"
                 label="Select Library"
                options={libraries}
                  styles={dropdownStyles}
                  required={true}
                  onChange={(e, selection: any) => { this.setState({ selectedDocLib: selection.key }) }}
                />


            </Stack>

            <Stack className={styles.footerContent}>
                <PrimaryButton disabled={this.state.folderName == "" || this.state.selectedDocLib == ""} className={`${styles.chooseBtn} ${styles.standardButton}`} onClick={this.createFolder}>
  Create Folder
</PrimaryButton>

  <PrimaryButton className={`${styles.seeAll} ${styles.standardButton}`}  onClick={() => {
                  this.setState({ createFolderPopUp: false });
                }}>
    Cancel
  </PrimaryButton>
  </Stack>

            </Modal>
 

        </Stack>
  </section>
    );
  }
}
