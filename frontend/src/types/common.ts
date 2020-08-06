export declare namespace CommonTypes {

  export namespace NodeTypes {

    export interface Node {
      domain: string, 
      author: string, 
      created: string, 
      aproved: string, 
      description: string,
      id: string
    }
  
    export interface CurrentNode {
      host: string,
      token: string,
    }
  }

  export namespace NotificationTypes {
    
    export interface LastKnown {
      host?: string
      id: string
    }
  }

}