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
  dropdown: { width: 160 ,borderRadius:4},
};

let options: IDropdownOption[] = [];
let selectedPRoductkey = '';
options = [
  { key: 'All', text: 'All' },
  { key: 'Type A', text: 'Type A' },
  { key: 'Type B', text: 'Type B' },
];
//let appOptions :  IDropdownOption[] = [];

// const stackTokens: IStackTokens = { childrenGap: 20 };

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
      CPArr: [],
      CTInfoArr: [],
      ITArr: [],
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
     //const simple = await commonService.simple(Constants.LIST_NAMES.AE_RESOURCES);
     
     //console.log("Ae Resources Simple data",simple);
     // console.log("Here is AE resources",aeResources);
    

      // Mapping data
   // Create an array to store unique product groups


      await aeResources.map((element: any) => {
        const fileName = element.File.Name;
        const fileExtention = fileName.split('.').pop().toLowerCase();
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: fileExtention,
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup: element.Productgroup,
          application:element.Application,
          CesArr: [
            ...this.state.CesArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: fileExtention,
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup: element.Productgroup,
              application:element.Application
            },
          ],
        });

        
      });
      console.log("Here are the AE Resources",this.state.CesArr);




      // CP Resources
      const cpResources = await commonService.getItems(Constants.LIST_NAMES.CUSTOMER_PRESENTATION);
      //console.log("Customer presentation", cpResources);

      await cpResources.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          CPArr: [
            ...this.state.CPArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });
      });

      //Competitive Information
      const ctInfo = await commonService.getItems(Constants.LIST_NAMES.COMPETITIVE_INFORMATION);
      //console.log("Competitive Information..", ctInfo);
      await ctInfo.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          CTInfoArr: [
            ...this.state.CTInfoArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });
      });

      //Internal tranings
      const it = await commonService.getItems(Constants.LIST_NAMES.INTERNAL_TRANINGS);
      //console.log("Internal Training..", it);
      await it.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          productGroup:element.Productgroup,
          application:element.Application,
          ITArr: [
            ...this.state.ITArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
              productGroup:element.Productgroup,
              application:element.Application
            },
          ],
        });
      });
    } catch (error) {
      //console.log(error);
    }
  }

  private renderFileTypeIcon = (
    item: any,
    index: number,
    column: IColumn
  ): JSX.Element => {
    const fileTypeIconProps = {
     
      type: IconType.image,
      path: item.Title,
      size: ImageSize.small,
    };

    return <FileTypeIcon {...fileTypeIconProps} />;
  };



  handleFileDrop = (files: any[]) => {
    const file = files[0];
    this.setState({ file: file, uploadedFileName: file.name });
  };

  public handleFileUpload = async () => {
    const _files = this.state.file;
    //console.log("Files to be stored here := ", _files);
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (_files.length === 0) {
      alert("No files were selected.");
      return;
    }
    const _file = _files;
    this.setState({ file: _file, uploadedFileName:_files.name});
    
    
    // const _listName = "BannerImage";
    const _folderPath = "/sites/FrahanTest/Internal Tranings";
    if (_file) {
      sp.web.getFolderByServerRelativePath(_folderPath).files.addUsingPath(_file.name, _file, { Overwrite: true })
     

        .then(async (response: any) => {

          
          const _fileId = response.data.UniqueId;
          this.setState({ fieldId: _fileId });
          const imageUrl = response.data.ServerRelativeUrl;
          this.setState({ uploadedFile: imageUrl,IsAdd:false ,ITArr:[]});
          this.componentDidMount();
          //console.log("Image Url", imageUrl);


          // this.addItem(imageUrl);
        });
    }

    if (_file.size > maxSizeInBytes) {
      this.setState({ uploadedFileError: "File size exceeds the 10MB limit." });
      return;
    }
    this.setState({ uploadedFileError: "" });

    this.setState({ itemId: _file.itemId });
    this.setState({ uploadedFileName: _file.path });
  };

  Productgroup = async (e: any, selection: any) => {
  
   console.log("Selection key",selection.key);
  //  console.log("This is CesArr", this.state.CesArr);
  this.setState({CesArr:[],ITArr:[],CPArr:[],CTInfoArr:[]})
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

applicationRendering = async (e:any, selection:any) => {
  if (selection.key === "All") {
    this.setState({ CesArr: [] });
    this.componentDidMount();
    return;
  }
  console.log("CES ARRay:", this.state.CesArr);
  const filteredArr = this.state.CesArr.reduce((acc: any, item: any) => {
    if (item.application == selection.key && item.application == selectedPRoductkey) {
      acc.push(item);
      console.log("Accumulator", acc);
    }
    return acc;
  }, []);
  const filteredInternalTraningArr = this.state.ITArr.reduce((acc: any, item: any) => {
    if (item.productGroup === selection.key && item.application == selectedPRoductkey) {
      acc.push(item);
    }
    return acc;
  }, []);
  const filteredCPArr = this.state.CPArr.reduce((acc: any, item: any) => {
    if (item.productGroup === selection.key && item.application == selectedPRoductkey) {
      acc.push(item);
    }
    return acc;
  }, []);
  const filteredCTIinfoArr = this.state.CTInfoArr.reduce((acc: any, item: any) => {
    if (item.productGroup === selection.key && item.application == selectedPRoductkey) {
      acc.push(item);
    }
    return acc;
  }, []);
  this.setState({ CesArr: filteredArr, ITArr: filteredInternalTraningArr, CPArr: filteredCPArr, CTInfoArr: filteredCTIinfoArr });
  console.log("Filtered Array", filteredArr);
}


createFolder = async () =>{
  try {
    const application= this.state.application;
    const productGroup = this.state.productGroup;
    // Ensure authentication is done before performing any operation
   // await sp.web.folders.addUsingPath("Internal Tranings/Internal Traningsf");
  const temp =  await sp.web.folders.addUsingPath(`Internal Tranings/${this.state.folderName}`);
  console.log("Temp : " ,temp,"Aooku",application,"Product group",productGroup);
   
   
    


    console.log("Folder created successfully");
  } catch (error) {
    console.log("Error creating folder:", error);
  }
}


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
/>
        <Dropdown
  placeholder="Select"
  label="Applications"
 
  
  options={options}
  styles={dropdownStyles}
  onChange={this.applicationRendering}
/>
        <Dropdown
        
  placeholder="Select"
  label="File type"
  multiSelect={true}
  options={options}
  styles={{ 
    dropdown: { 
      width: '200px' // Adjust the width as needed
    },
    ...dropdownStyles // If you have additional styles, spread them here
  }}
  onChange={()=>{this.applicationRendering}}
/>
        </Stack>
        
        <Stack style={{paddingTop:"2.5%"}}>
          <TextField placeholder="Search" 
          onRenderPrefix={() => (
            <IconButton
              //className={styles.searchButton}
              iconProps={{ iconName: 'Search' }}
              // onClick={this._handleSearchButtonClick}
            />
          )}
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

          <Modal 
          isOpen={this.state.IsAdd}
          onDismiss={() => this.setState({ IsAdd: false })}
          isBlocking={false}
            //styles={{ main: { maxWidth: 450 } }}
          styles={{ main: { width: "60%", height: "50%" } }}
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
       
                <Stack className={styles.footerContent}>
                <PrimaryButton  className={`${styles.chooseBtn} ${styles.standardButton}`} onClick={this.handleFileUpload}>
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
  placeholder="Select"
  label="Product Group"
  
  options={options}
  styles={dropdownStyles}
  onChange={(selection:any)=>{this.setState({productGroup:selection.key})}}
/>
        <Dropdown
  placeholder="Select"
  label="Applications"
 
  
  options={options}
  styles={dropdownStyles}
  onChange={(selection:any)=>{this.setState({application:selection.key})}}
/>
            </Stack>

            <Stack className={styles.footerContent}>
                <PrimaryButton  className={`${styles.chooseBtn} ${styles.standardButton}`} onClick={this.createFolder}>
  Create Folder
</PrimaryButton>

  <PrimaryButton className={`${styles.seeAll} ${styles.standardButton}`} onClick={()=>{this.setState({IsAdd:false})}}>
    Cancel
  </PrimaryButton>
  </Stack>

            </Modal>
 
 
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

        </Stack>
  </section>
    );
  }
}
