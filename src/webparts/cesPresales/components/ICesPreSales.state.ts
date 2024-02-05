export interface ICesState{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
    
    CesArr:ICesArr[];
}
interface ICesArr{
    ID:string;
    Title:string;
   
    ModifiedBy:string;
    ModifiedOn:string;
}