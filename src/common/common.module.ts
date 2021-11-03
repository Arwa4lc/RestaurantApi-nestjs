import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [ConfigModule],
  providers: [JwtGuard, RolesGuard],
})
export class CommonModule {}
