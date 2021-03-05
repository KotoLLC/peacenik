export declare namespace CommonTypes {

  export namespace HubTypes {

    export interface Hub {
      domain: string, 
      author: string, 
      created: string, 
      aproved: string, 
      description: string,
      id: string
    }
  
    export interface CurrentHub {
      host: string,
      token: string,
    }

    export type CreationStatus = 'pending' | 'approved' | ''
  }

  export namespace NotificationTypes {
    
    export interface LastKnown {
      host?: string
      id: string
    }
  }

}