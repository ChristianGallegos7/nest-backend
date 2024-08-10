import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
