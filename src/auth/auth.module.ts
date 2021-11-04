import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Model } from 'mongoose';
import { AuthController } from './auth.controller';
import { User, userSchema } from './auth.model';
import { AuthService } from './auth.service';
import authConfig from './config/auth.config';
import { JwtStrategy } from './jwt-strategy';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => ({
        secret: config.get('JWT_KEY'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ConfigModule.forFeature(authConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {
  constructor(
    @InjectModel('User') private readonly User: Model<User>,
    private configService: ConfigService,
  ) {
    this.createAdmin();
  }

  async createAdmin() {
    let admin = await this.User.findOne({ role: 'admin' });
    if (admin) {
      return console.log('Admin found');
    }

    admin = await this.User.create({
      name: 'Arwa abdelrahem',
      email: this.configService.get('USER_EMAIL'),
      password: await bcrypt.hash(this.configService.get('USER_PASSWORD'), 12),
      role: 'admin',
    });
    return console.log('Admin created');
  }
}
