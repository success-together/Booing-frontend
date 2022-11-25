export interface ExecutorInterface {
  method: "get" | "post" | "delete" | "put";
  url: string;
  head ?:{'Content-Type': string,token ?: string}; 
  data?: any;
  successFun?: (data: any) => void;
  errorFun?: (data: any) => void;
  isSilent?: boolean;
  withoutToast?: boolean;
  rapidApi?: boolean;
}
