import { BaseConfig } from 'core/base-config.service';
import { SwaggerDocumentOptions } from '@nestjs/swagger';
import { LoginResponseSchema } from '../modules/auth/schemas/login-response.schame';
import { QueueOptions } from 'bull';

class Config extends BaseConfig {
  public getExtraModels(): SwaggerDocumentOptions {
    return {
      extraModels: [LoginResponseSchema],
    };
  }

  getHostAndPort(): { host: string; port?: string } {
    try {
      return {
        host: this.getValue('HOST'),
        port: this.getValue('PORT'),
      };
    } catch (e) {
      return {
        host: '0.0.0.0',
      };
    }
  }

  public getSwaggerEnabled(): boolean {
    try {
      return this.asBool(this.getValue('ENABLE_SWAGGER'));
    } catch (e) {
      return false;
    }
  }

  public getIsTesting(): boolean {
    try {
      return this.getValue('ENV', true) == 'testing';
    } catch (e) {
      return false;
    }
  }

  public getRedisTimeout(): number {
    return this.getIsStaging() ? 300 : 86400;
  }

  public getRedisConfig(): QueueOptions {
    return {
      redis: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        host: this.getValue('REDIS_HOST'),
        port: 6379,
      },
    };
  }

  public getJwtSecret(): string {
    return this.getValue('JWT_SECRET');
  }

  public getEncryptionKey(): string {
    return this.getValue('ENCRYPTION_KEY');
  }

  public getJwtExpire(): number {
    return this.asInt(this.getValue('JWT_EXPIRE_SEC'));
  }

  public getIsStaging(): boolean {
    try {
      return this.getValue('NODE_ENV', true).toLowerCase() == 'staging';
    } catch (e) {
      return false;
    }
  }

  public getIsDevelopment(): boolean {
    try {
      return this.getValue('NODE_ENV', true).toLowerCase() == 'development';
    } catch (e) {
      return false;
    }
  }
}

const configService = new Config(process.env);

type ConfigService = typeof configService;

export { configService, ConfigService };
