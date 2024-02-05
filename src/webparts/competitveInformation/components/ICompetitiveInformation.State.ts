export interface ICompetitiveInformationState{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
    CiArr:ICompetitiveInformation[];

}
interface ICompetitiveInformation{
    ID:string;
    Title:string;
    ModifiedBy:string;
    ModifiedOn:string;
}