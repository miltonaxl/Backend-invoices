/**
 * This file contains the Invoice entity.
 * @packageDocumentation
 * @module invoices
 * @preferred
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Client } from '../clients/entity';
import { InvoiceItem } from './item.entity';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, { onDelete: 'CASCADE' })
    client: Client;

    @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, { cascade: true })
    items: InvoiceItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @CreateDateColumn()
    created_at: Date;
}
