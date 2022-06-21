import { Injectable, Inject } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { RedisProvider } from 'src/db/redis/redis.provider';
import { CreatePuppyDto, GetPuppyDto } from '../dtos/puppy.dtos';
import getDataFromSnapshot from 'src/utils/getDataFromSnapshot';

@Injectable()
export class PuppyService {
  constructor(
    @Inject(CreatePuppyDto.collectionName)
    private collection: CollectionReference<CreatePuppyDto>,
    private redisClient: RedisProvider,
  ) {}

  async create(queryUser): Promise<any> {
    const tableName = this.collection.id;
    const redisKeys = await this.redisClient.getKeysInclude(tableName);
    redisKeys.forEach(async (key) => {
      await this.redisClient.delete(key);
    });

    const snapshot = await this.collection
      .where('completeName', '==', queryUser.completeName)
      .get();
    if (!snapshot.empty) {
      console.log('puppy already exists' + queryUser.completeName);
      return { alreadyExists: true };
    }

    const puppy: GetPuppyDto = {
      ...queryUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = this.collection.doc();
    await docRef.set(puppy);
    const userDoc = await docRef.get();
    return userDoc.data();
  }

  async findAll(): Promise<any[]> {
    const tableName = this.collection.id;
    const redisData = await this.redisClient.get(tableName);

    if (!redisData) {
      console.log(tableName + ': Served from DB');
      const snapshot = await this.collection.get();
      const data = getDataFromSnapshot(snapshot);
      if (data) this.redisClient.update(tableName, data);
      return data;
    }
    console.log(tableName + ': Served from Redis');
    return redisData;
  }

  async findBy(prop, value): Promise<any[]> {
    const tableName = this.collection.id + '_' + prop + '_' + value;

    const searchById = async () => {
      const docRef: any = await this.collection.doc(value).get();
      if (docRef.exists) {
        const data = { id: docRef.id, ...docRef.data() };
        if (data) this.redisClient.update(tableName, data);
        return data;
      } else {
        return false;
      }
    };

    const searchByProp = async () => {
      value = value === 'true' ? true : value;

      const snapshot = await this.collection.where(prop, '==', value).get();
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      const data = getDataFromSnapshot(snapshot);
      if (data) this.redisClient.update(tableName, data);
      return data;
    };

    const redisData = await this.redisClient.get(tableName);

    if (!redisData) {
      console.log(tableName + ': Served from DB');
      if (prop === 'id') {
        return searchById();
      } else {
        return searchByProp();
      }
    }

    console.log(tableName + ': Served from Redis');
    return redisData;
  }

  async update(id: string, changes: any): Promise<any> {
    // Delete Redis
    const tableName = this.collection.id;
    const redisKeys = await this.redisClient.getKeysInclude(tableName);
    redisKeys.forEach(async (key) => {
      await this.redisClient.delete(key);
    });

    const searchById = async () => {
      const doc = this.collection.doc(id);
      const docRef: any = await doc.get();
      if (docRef.exists) {
        return doc;
      } else {
        return null;
      }
    };

    const docRef = await searchById();
    const doc = await docRef.get();
    const data = doc.data();

    if (docRef && changes) {
      const updateChanges = {
        ...changes,
        updatedAt: new Date(),
      };

      await docRef.update(updateChanges);
      const offerDoc = await docRef.get();
      return offerDoc.data();
    } else {
      return {
        error:
          '🚀 ~ file: puppy.service ~ line 89 ~ PuppyService ~ update ~ Error',
        changes,
        data,
      };
    }
  }

  async delete(id: string): Promise<any> {
    // Delete Redis
    const tableName = this.collection.id;
    const redisKeys = await this.redisClient.getKeysInclude(tableName);
    redisKeys.forEach(async (key) => {
      await this.redisClient.delete(key);
    });

    if (id) {
      return await this.collection.doc(id).delete();
    } else {
      return (
        '🚀 ~ file: puppy.service ~ line 92 ~ PuppyService ~ delete ~ id' + id
      );
    }
  }
}
