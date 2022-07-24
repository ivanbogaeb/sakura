declare const BrowserWindow: any;
declare let sakuraWindow: any;
declare const windowCreator: (isElectron: boolean, properties: any, HTMLFile: string) => Promise<unknown>;
declare const windowMessenger: (isElectron: boolean, { type, payload }: any) => Promise<unknown>;
declare const windowClose: (isElectron: boolean) => void;
