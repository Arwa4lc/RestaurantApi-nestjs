import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly user: Model<User>,
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
    signUpDto.password = await bcrypt.hash(signUpDto.password, 12);

    let user = await this.user.create(signUpDto);
    const token = this.generateToken(user);

    return { token, user };
  }

  async validateUser(email: string, password: string) {
    const user = await this.user.findOne({ email });
    const compare = await bcrypt.compare(password, user.password);

    if (user && compare) {
      return user;
    }

    return null;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.user.findOne({ email: signInDto.email });
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
