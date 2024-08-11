import { Empleo } from './entities/empleo.entity';
import { Module } from '@nestjs/common';
import { EmpleosService } from './empleos.service';
import { EmpleosController } from './empleos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { Postulacion } from './entities/postulaciones.entity';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmpleosController],
  providers: [EmpleosService],
  imports: [
    TypeOrmModule.forFeature([Empleo, Postulacion, Company,User]),
    CompaniesModule,
    AuthModule
  ],
})
export class EmpleosModule { }
