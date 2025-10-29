import type { SaveCollection } from "../modalsInterfaces/Save";

export interface CreateSaveCollectionData {
    name: string;
    description?: string;
  }
  export interface UpdateSaveCollectionData {
    name?: string;
    description?: string;
  }
  export interface ToggleBlogInCollectionResponse {
    saved: boolean;
    collection: SaveCollection;
  }
  