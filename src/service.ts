import { SSMClient, paginateGetParametersByPath, Parameter } from '@aws-sdk/client-ssm';

export class Service {
    private client: SSMClient;

    constructor(data: { region: string }) {
        this.client = new SSMClient({
            region: data.region,
        });
    }

    async findAll(path: string) {
        const paginatorConfig = {
            client: this.client,
            pageSize: 10,
        };

        const commandInput = {
            Path: path,
            Recursive: false,
            WithDecryption: true,
        };

        const allParameters: Parameter[] = [];

        for await (const page of paginateGetParametersByPath(paginatorConfig, commandInput)) {
            if (page.Parameters) {
                allParameters.push(...page.Parameters);
            }
        }

        return allParameters;
    }

    transformKey(key: string) {
        const lastSlashIndex = key.lastIndexOf('/');
        return lastSlashIndex === -1 ? key : key.substring(lastSlashIndex + 1);
    }
}
