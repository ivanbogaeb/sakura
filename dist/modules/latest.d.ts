declare const latest: (axios: any, timer: any, windowMessenger: any, isElectron: boolean, messages: any, gitUsername: string, gitRepository: string, privateToken: string) => Promise<{
    tagname: any;
    url: any;
} | undefined>;
