export {};

// Workaround type https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23976
declare global {
  namespace Express {
      interface User {
        userId: string;
      }
  }
}