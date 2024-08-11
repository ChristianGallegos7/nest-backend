import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: 
  [
    TypeOrmModule.forFeature([Company]),
    AuthModule
  ],
  exports: [
    TypeOrmModule,
    CompaniesService
  ]
})
export class CompaniesModule { }
