import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule, // 👈 pour accéder à UserService (findByEmail, create)
    PassportModule,
    JwtModule.register({
      secret: 'irma_secret_key', //  même clé que dans jwt.strategy.ts
      signOptions: { expiresIn: '24h' }, // token valide 24h
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}