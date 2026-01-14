import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm';

export class Service {
    private client: SSMClient;

    constructor(data: { region: string }) {
        this.client = new SSMClient({
            region: data.region,
        });
    }

    async findAll(path: string) {
        const command = new GetParametersByPathCommand({
            Path: path,
            Recursive: true,
            WithDecryption: true,
        });
        return this.client.send(command);
    }

    transformKey(key: string) {
        const lastSlashIndex = key.lastIndexOf('/');
        return lastSlashIndex === -1 ? key : key.substring(lastSlashIndex + 1);
    }
}
