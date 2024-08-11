import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleoDto } from './dto/create-empleo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleo } from './entities/empleo.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';
import { Postulacion } from './entities/postulaciones.entity';

@Injectable()
export class EmpleosService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Postulacion)
    private readonly postulacionRepository: Repository<Postulacion>,
    @InjectRepository(Empleo)
    private readonly empleoRepository: Repository<Empleo>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) { }



  async create(createEmpleoDto: CreateEmpleoDto) {
    const company = await this.companyRepository.findOneBy({ id: createEmpleoDto.companyId });

    if (!company) {
      throw new Error('Company not found');
    }

    const empleo = this.empleoRepository.create(createEmpleoDto);
    empleo.company = company;
    return this.empleoRepository.save(empleo);

  }

  findAll() {
    return this.empleoRepository.find({ relations: ['company'] });
  }

  findOne(id: number) {
    return this.empleoRepository.findOne({ where: { id }, relations: ['company'] });
  }

  async postularse(empleoId: number, userId: number): Promise<Postulacion> {
    const empleo = await this.empleoRepository.findOneBy({ id: empleoId });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!empleo || !user) {
      throw new NotFoundException('Empleo o Usuario no encontrado');
    }

    const postulacion = this.postulacionRepository.create({
      empleo,
      user,
      status: 'pendiente',
      fechaPostulacion: new Date(),
    });

    return await this.postulacionRepository.save(postulacion);
  }
}
