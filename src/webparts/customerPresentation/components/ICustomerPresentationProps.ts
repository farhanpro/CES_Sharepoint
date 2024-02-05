import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ICustomerPresentationProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  spcontext:WebPartContext;
}
