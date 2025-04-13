export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
declare module '@gradio/client' {
  export class Client {
    static connect(endpoint: string): Promise<Client>;
    predict(path: string, payload: Record<string, any>): Promise<{ data: any }>;
  }
}