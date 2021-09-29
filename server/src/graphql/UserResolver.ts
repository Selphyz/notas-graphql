import { compare, hash } from "bcryptjs";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import { generateAccessToken, generateLongAccessToken, sendRefreshToken } from "../utils/generateToken";
import { MyContext } from "../types";

@ObjectType()
class LoginResponse{
  @Field(()=>String)
  access_token: string;
}
@Resolver()
export class UserResolver{
  @Query(()=> String)
  hello(){
    return "Hello World"
  }

  @Mutation(() => Boolean)
  async signup(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const findUser = await User.findOne({ where: { email } });
      if (findUser) throw new Error("User with that email is already exist");

      await User.insert({
        email,
        password: await hash(password, 12),
        username: email.split("@")[0],
      });
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
    ) {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User with that email is doesn't exist");
        
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) throw new Error("Password is invalid");
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateLongAccessToken(user);
        
        sendRefreshToken(res, refreshToken);
        
        // res.set({
        //   "Access-Control-Allow-Origin": "https://studio.apollographql.com",
        //   "Access-Control-Allow-Credentials": true
        // });    
        return {
          access_token: accessToken,
        };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
