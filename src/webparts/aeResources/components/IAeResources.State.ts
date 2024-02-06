export interface IAeResourcesState{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
    FileType:string;
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
}