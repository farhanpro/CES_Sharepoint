export interface IAeResourcesState{
    ID:string;
    Title:string;
    Image:any;
    ModifiedBy:string;
    ModifiedOn:string;
    FileType:string;
    IsAdd:boolean;
    productGroup:string;
    
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
    CPArr:IAeresourcesArr[];
    CTInfoArr:IAeresourcesArr[];
    ITArr:IAeresourcesArr[];

    

    
}
interface IAeresourcesArr{
    ID:string;
    Title:string;
    FileType:string;
    ModifiedBy:string;
    ModifiedOn:string;
    productGroup:string;   
}