export interface IAeResourcesState{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
    CesArr:IAeresourcesArr[];
}
interface IAeresourcesArr{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
}