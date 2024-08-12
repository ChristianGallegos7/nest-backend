import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { LoginCompanyDto } from './dto/login-company.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CompaniesService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);
      const company = this.companyRepository.create({ ...createCompanyDto, password: hashedPassword });
      return await this.companyRepository.save(company);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async login(loginCompanyDto: LoginCompanyDto): Promise<{ company: Company; token: string }> {
    try {
      const { email, password } = loginCompanyDto;
      const company = await this.companyRepository.findOne({ where: { email } });

      if (!company) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload = { id: company.id, email: company.email };
      const token = await this.jwtService.signAsync(payload);

      delete company.password;

      return { company, token };
    } catch (error) {
      console.error('Error authenticating company:', error);
      throw new UnauthorizedException('Error authenticating company.');
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find({ relations: ['empleos'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async findOne(id: number): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({ where: { id }, relations: ['empleos'] });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve company');
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      await this.companyRepository.update(id, updateCompanyDto);
      return await this.companyRepository.findOneBy({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      await this.companyRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}
