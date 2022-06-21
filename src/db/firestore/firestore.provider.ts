import { CreatePuppyDto } from 'src/puppy/dtos/puppy.dtos';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  CreatePuppyDto.collectionName,
];
