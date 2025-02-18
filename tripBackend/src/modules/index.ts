import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';

export const Modules = [DatabaseModule, HealthCheckModule, AuthModule];
