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

let sp: SPFI;
let commonService: any = null;
// let items: any = null;

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

      CesArr: [],
      CPArr: [],
      CTInfoArr: [],
      ITArr: [],
    };
    sp = spfi().using(SPFx(this.props.spcontext));
    console.log("Sp installed", sp);

    this.onDrop = (files) => {
      this.setState({ Image: files });
    };

    commonService = new DataServices(this.props.spcontext);
  }

  async componentDidMount(): Promise<void> {
    // const data: { Name: any;Modified:any; ModifiedBy: any; FileType: string;FileRed:string;FileLeafRef:string; }[] = [];
    try {
      // get documents using pnp js web
      const aeResources = await commonService.getItems("AE Resources");
      console.log(aeResources);

      // Mapping data
      await aeResources.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          CesArr: [
            ...this.state.CesArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
            },
          ],
        });
      });

      // CP Resources
      const cpResources = await commonService.getItems("Customer Presentation");
      console.log("CP Resources..", cpResources);

      await cpResources.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          CPArr: [
            ...this.state.CPArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
            },
          ],
        });
      });

      //Competitive Information
      const ctInfo = await commonService.getItems("Competitive Information");
      console.log("Competitive Information..", ctInfo);
      await ctInfo.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          CTInfoArr: [
            ...this.state.CTInfoArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
            },
          ],
        });
      });

      //Internal tranings
      const it = await commonService.getItems("Internal Tranings");
      console.log("Internal Training..", it);
      await it.map((element: any) => {
        const fileName = element.File.Name;
        this.setState({
          ID: element.ID,
          Title: fileName,
          ModifiedBy: element.Editor.Title,
          FileType: "",
          ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
          ITArr: [
            ...this.state.ITArr,
            {
              ID: element.ID,
              Title: fileName,
              FileType: "",
              ModifiedBy: element.Editor.Title,
              ModifiedOn: moment(element.Modified).format("DD-MM-YYYY"),
            },
          ],
        });
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
    const fileTypeIconProps = {
      type: IconType.image,
      path: item.Title,
      size: ImageSize.small,
    };

    return <FileTypeIcon {...fileTypeIconProps} />;
  };

  public handleFileUpload = async (_files: any) => {
    console.log("Files to be stored here := ", _files);
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (_files.length === 0) {
      alert("No files were selected.");
      return;
    }
    const _file = _files[0];
    this.setState({ file: _file[0] });
    // const _listName = "BannerImage";
    const _folderPath = "/sites/FrahanTest/Internal Tranings";
    if (_file) {
      sp.web
        .getFolderByServerRelativePath(_folderPath)
        .files.addUsingPath(_file.name, _file, { Overwrite: true })
        .then(async (response: any) => {
          console.log(response);
          const _fileId = response.data.UniqueId;
          this.setState({ fieldId: _fileId });
          const imageUrl = response.data.ServerRelativeUrl;
          this.setState({ uploadedFile: imageUrl });
          console.log("Image Url", imageUrl);


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

  public render(): React.ReactElement<IAeResourcesProps> {
    return (
      <Stack>
        <Stack horizontal style={{ marginTop: "15px" }}>
          <Stack className={styles.tempCss}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Internal traning</Text>
              <Stack
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "180px",
                }}
              >
                <Icon
                  iconName="CloudUpload"
                  aria-label="Add Online Event Icon"
                  style={{ fontSize: "20px", color: "#646E81" }}
                />
                <span>Drag and drop files here</span>
              </Stack>

              <PrimaryButton
                style={{
                  width: "132px",
                  height: "32px",
                  borderRadius: "4px",
                  backgroundColor: "#5A2A82",
                }}
                onClick={() => {this.setState({IsAdd:true})}}
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
                  name: "File Type",
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
            styles={{ main: { maxWidth: 450 } }}
        //  styles={{ main: { width: "50%", height: "85%" } }}
          >
            
          <Dropzone onDrop={(files) => this.handleFileUpload(files)}>
                {({ getRootProps, getInputProps }) => (
                  <Stack>
                    <Stack
                      {...getRootProps({
                        onDrop: (event) => event.stopPropagation(),
                      })}
                      
                    >
                      <input
                        {...getInputProps()}
                        placeholder="No File Chosen"
                        required
                        //style={{ display: "none" }} // Hide the default input style
                      />
                      <Icon
                        iconName="CloudUpload"
                        style={{
                          fontSize: "38px",
                          color: "#5A2A82",
                          marginBottom: "10px", // Adjust spacing as needed
                        }}
                      />
                      <p>Drag and Drop files here, Or click to select files</p>
                      <div>
                        <PrimaryButton >
                          Choose File
                        </PrimaryButton>
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
          </Modal>

          <Stack className={styles.tempCss} style={{ marginLeft: "15px" }}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Customer Presentations</Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <DetailsList
              items={this.state.CPArr}
              columns={[
                {
                  key: "FileType",
                  name: "File Type",
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

        <Stack horizontal style={{ marginTop: "15px" }}>
          <Stack className={styles.tempCss}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>Ae Resources</Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <DetailsList
              items={this.state.CesArr}
              columns={[
                {
                  key: "FileType",
                  name: "File Type",
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

          <Stack className={styles.tempCss} style={{ marginLeft: "15px" }}>
            <Stack className={styles.headingRow}>
              <Text className={styles.headingText}>
                Competitive Information
              </Text>
              <PrimaryButton className={styles.seeAll}>See all</PrimaryButton>
            </Stack>
            <DetailsList
              items={this.state.CTInfoArr}
              columns={[
                {
                  key: "FileType",
                  name: "File Type",
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
    );
  }
}
