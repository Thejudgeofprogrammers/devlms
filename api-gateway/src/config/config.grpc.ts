import { Transport, ClientOptions } from "@nestjs/microservices";
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const grpcClientOptionsAuth: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: '',
        package: '',
        protoPath: '',
    }
}
