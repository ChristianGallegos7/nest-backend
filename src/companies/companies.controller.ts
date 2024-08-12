import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { LoginCompanyDto } from './dto/login-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post('register')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Post('login')
  login(@Body() loginCompanyDto: LoginCompanyDto) {
    return this.companiesService.login(loginCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

}
