import Park, { IPark } from '@models/park/park.model';
import Reservation from '@src/models/park/book.model';
import USER_SERVICE from '@services/user/user.service';
import { IUser } from '@src/models/users/user.model';
import COMMON_UTIL from '@src/utils/commonUtil';

import { ICreatePark, ICreateReservation } from './park.service.interface';

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

  export async function createReservation(data: ICreateReservation): Promise<boolean> {
    const parkTarget = await Park.findOne({ _id: data.parkTarget });
    const requestUser = await USER_SERVICE.getUserWithId(data.requestUser);
    const { startTime, useMin } = data;

    if (parkTarget && requestUser) {
      const book = new Reservation({
        parkTarget,
        requestUser,
        startTime,
        useMin,
      });
      await book.save();
      parkTarget.inUse = true;
      await parkTarget.save();
      return true;
    }
    return false;
  }

  export async function listReservation(userId: IUser['_id']): Promise<Record<string, any>[] | undefined> {
    const foundUser = await USER_SERVICE.getUserWithId(userId);
    if (foundUser) {
      const reserveList = await Reservation.find({ requestUser: foundUser });
      const summary = [];
      for (const reserve of reserveList) {
        const park = await PARK_SERVICE.getPark(reserve.parkTarget);
        if (park) {
          summary.push({
            _id: reserve._id,
            startTime: reserve.startTime,
            useMin: reserve.useMin,
            createdAt: COMMON_UTIL.convertPrettyKST(reserve.createdAt as Date),
            parkId: park._id,
            parkName: park.name,
            parkAddr: park.address,
            purchased: COMMON_UTIL.priceLocaleString(Math.floor(park.cost * (reserve.useMin / 60))),
          });
        }
      }
      return summary;
    }
    return undefined;
  }
}

export default PARK_SERVICE;
