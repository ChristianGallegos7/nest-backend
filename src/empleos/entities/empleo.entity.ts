import { Company } from '../../companies/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Postulacion } from './postulaciones.entity';

@Entity()
export class Empleo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    location: string;

    @Column()
    salary: number;

    @ManyToOne(() => Company, company => company.empleos)
    company: Company;

    @ManyToOne(() => Postulacion, postulacion => postulacion.empleos)
  postulaciones: Postulacion[];

}
