import Park, { IPark } from '@models/park/park.model';
import { ICreatePark } from './park.service.interface';

namespace PARK_SERVICE {
  export async function listPark(): Promise<IPark[] | null> {
    const parkList = await Park.find({});
    return parkList;
  }

  export async function getPark(parkId: IPark['_id']): Promise<IPark | null> {
    const foundPark = await Park.findOne({ _id: parkId });
    if (foundPark) return foundPark;
    return null;
  }

  export async function createPark(data: ICreatePark): Promise<boolean> {
    const newPark = new Park(data);
    await newPark.save();
    return true;
  }
}

export default PARK_SERVICE;
