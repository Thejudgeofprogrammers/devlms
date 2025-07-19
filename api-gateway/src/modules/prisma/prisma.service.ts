import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements
    OnModuleInit, OnModuleDestroy {

    constructor(private readonly configService: ConfigService) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        await this.ensureAdminUser();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    private async ensureAdminUser() {
        const adminEmail = this.configService.get<string>('admin.email');

        const admin = await this.user.findUnique({
            where: { email: adminEmail },
        });

        if (!admin) {
            const password = this.configService.get<string>('admin.password')
            const hashedPassword = await bcrypt.hash(password, 10);

            const role = await this.role.upsert({
                where: { role_id: 1 },
                update: {},
                create: { role: 'Admin' },
            });

            const contacts = await this.contacts.create({
                data: {
                    country: 'DefaultCountry',
                    city: 'DefaultCity',
                    time_zone: 'UTC+0',
                },
            });

            const userInfo = await this.userInfo.create({
                data: {
                    name: 'Admin',
                    fam: 'Admin',
                    surname: 'Admin',
                    citizenship: 'None',
                    faculty: 'None',
                    speciality: 'None',
                    profile: 'None',
                    level_of_training: 'None',
                    form_learning: 'None',
                    study_group: 'None',
                    language: 'RU',
                },
            });

            await this.user.create({
                data: {
                    login: 'admin',
                    email: adminEmail,
                    password: hashedPassword,
                    photo_url: '',
                    first_entry: new Date(),
                    last_entry: new Date(),
                    phone_number: '0000000000',
                    role: { connect: { role_id: role.role_id } },
                    contacts: { connect: { contact_id: contacts.contact_id } },
                    userInfo: { connect: { user_info_id: userInfo.user_info_id } },
                },
            });
            console.log('✅ Админ создан автоматически');
        } else {
            console.log('ℹ️ Админ уже существует');
        }
    }
}