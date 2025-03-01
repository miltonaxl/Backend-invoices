/**
 * @packageDocumentation
 * @module clients
 * @preferred
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Invoice } from '../invoices/entity';


@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    email: string;

    @OneToMany(() => Invoice, (invoice) => invoice.client)
    invoices: Invoice[];
}