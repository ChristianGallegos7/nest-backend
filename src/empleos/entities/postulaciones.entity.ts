import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Empleo } from './empleo.entity';

@Entity('postulaciones')
export class Postulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.postulaciones)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Empleo, empleo => empleo.postulaciones)
  @JoinColumn({ name: 'empleo_id' })
  empleo: Empleo;

  @Column('text')
  status: string; // Ej. 'pendiente', 'aceptado', 'rechazado'

  @Column('timestamp')
  fechaPostulacion: Date;
  @ManyToOne(() => Empleo, empleo => empleo.postulaciones)
  empleos: Empleo[];
}
