import {sign} from "jsonwebtoken";
import {Response} from "express";
import {CONST} from "../constants/strings";
import {User} from "../entity/User";

export const generateAccessToken = (user: User) =>{
  return sign({userId: user.id}, CONST.ACCESS_TOKEN, {expiresIn: "30m"})
}
export const generateLongAccessToken = (user: User) =>{
  return sign({userId: user.id}, CONST.ACCESS_TOKEN, {expiresIn: "3d"})
}
export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie(CONST.JWT_COOKIE, refreshToken, {
    httpOnly: true,
  });
};