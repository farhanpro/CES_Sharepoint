export interface ICesState{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
    FileType:string;
    CesArr:ICesArr[];
}
interface ICesArr{
    ID:string;
    Title:string;
    FileType:string;
    ModifiedBy:string;
    ModifiedOn:string;
}