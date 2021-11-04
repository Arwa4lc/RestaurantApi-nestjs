import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './auth.model';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly User: Model<User>,
    private jwtService: JwtService,
  ) {}

  generateToken(user: User) {
    const payload: JwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  async signUp(signUpDto: SignUpDto) {
    let user = await this.User.findOne({ email: signUpDto.email });
    if (user) {
      throw new BadRequestException('User with the same email already found');
    }

    try {
      signUpDto.password = await bcrypt.hash(signUpDto.password, 12);
      user = await this.User.create(signUpDto);

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.User.findOne({ email: signInDto.email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const compare = await bcrypt.compare(signInDto.password, user.password);
    if (!compare) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { token, user };
  }
}
