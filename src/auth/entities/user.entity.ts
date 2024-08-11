import { Postulacion } from "../../empleos/entities/postulaciones.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column()
    password: string;
    @Column()
    provincia: string;

    @Column()
    telefono: string;

    @OneToMany(() => Postulacion, postulacion => postulacion.user)
    postulaciones: Postulacion[];
}
