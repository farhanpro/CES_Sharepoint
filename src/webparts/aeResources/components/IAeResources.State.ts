export interface IAeResourcesState{
    ID:string;
    Title:string;
    Image:any;
    ModifiedBy:string;
    ModifiedOn:string;
    FileType:string;
    IsAdd:boolean;
    productGroup:string;
    application:string;
    selectedkeyApp:string;
    searchValue:string;
    selectedItem:any;
    createFolderPopUp:boolean;
    folderName:string;
    selectedDocLib : string;
    selectedProductGroup:string;
    selectedApplication:string;

    
    //For image upload 
    titleError: string;
    fileError : string;
    dialogMessage : string;
    isDialogVisible : boolean;
    bgError : string;
    uploadedFileName : string;
    uploadedFileError:string;
    file :any;
    fieldId : string;
    uploadedFile : any;
    itemId: number;
    errorMessage : string;
   


    CesArr:IAeresourcesArr[];
    originalDataCesArr: IAeresourcesArr[] // new state for original data
    CPArr:IAeresourcesArr[];
    originalDataCPArr: IAeresourcesArr[]
    CTInfoArr:IAeresourcesArr[];
    originalDataCTInfoArr: IAeresourcesArr[]
    ITArr:IAeresourcesArr[];
    originalDataITArr:IAeresourcesArr[]

    

    
}
interface IAeresourcesArr{
    ID:string;
    Title:string;
    FileType:string;
    ModifiedBy:string;
    ModifiedOn:string;
    productGroup:string;   
    application:string;
}