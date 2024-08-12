import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './province.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ProvinciasService {

    constructor(
        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>,
    ) { }


    findAll() {
        try {
            const provincias = this.provinceRepository.find();
            return provincias;
        } catch (error) {
            throw new NotFoundException('Provinces not found');
        }
    }

}
