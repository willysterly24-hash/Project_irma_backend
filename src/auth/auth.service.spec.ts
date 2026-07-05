import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock UserService
const mockUserService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn().mockReturnValue('fake_token_123'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // Reset les mocks avant chaque test
    jest.clearAllMocks();
  });

  // ===== TESTS REGISTER =====
  describe('register()', () => {

    it('✅ doit créer un compte et retourner un token', async () => {
      mockUserService.findByEmail.mockResolvedValue(null); // email pas encore utilisé
      mockUserService.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@irma.com',
        role: 'user',
      });

      const result = await authService.register('Test User', 'test@irma.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@irma.com');
    });

    it('❌ doit lancer ConflictException si email déjà utilisé', async () => {
      mockUserService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@irma.com',
      });

      await expect(
        authService.register('Test User', 'test@irma.com', 'password123')
      ).rejects.toThrow(ConflictException);
    });

    it('✅ doit hasher le mot de passe avant de sauvegarder', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@irma.com',
        role: 'user',
      });

      await authService.register('Test User', 'test@irma.com', 'monMotDePasse');

      const appelCreate = mockUserService.create.mock.calls[0][0];
      expect(appelCreate.password).not.toBe('monMotDePasse'); // pas en clair
      expect(await bcrypt.compare('monMotDePasse', appelCreate.password)).toBe(true);
    });
  });

  // ===== TESTS LOGIN =====
  describe('login()', () => {

    it('✅ doit retourner un token si credentials valides', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserService.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Admin',
        email: 'admin@irma.com',
        password: hashedPassword,
        statut: 'Actif',
        role: 'admin',
      });

      const result = await authService.login('admin@irma.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('admin@irma.com');
    });

    it('❌ doit lancer UnauthorizedException si email introuvable', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('inconnu@irma.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('❌ doit lancer UnauthorizedException si mot de passe incorrect', async () => {
      const hashedPassword = await bcrypt.hash('bonMotDePasse', 10);
      mockUserService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'admin@irma.com',
        password: hashedPassword,
        statut: 'Actif',
        role: 'admin',
      });

      await expect(
        authService.login('admin@irma.com', 'mauvaisMotDePasse')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('❌ doit lancer UnauthorizedException si compte bloqué', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'bloque@irma.com',
        password: hashedPassword,
        statut: 'Bloqué',
        role: 'user',
      });

      await expect(
        authService.login('bloque@irma.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
