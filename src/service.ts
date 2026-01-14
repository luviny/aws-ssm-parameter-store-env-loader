import { SSMClient, paginateGetParametersByPath } from '@aws-sdk/client-ssm';

export class Service {
    private client: SSMClient;

    constructor(data: { region: string }) {
        this.client = new SSMClient({
            region: data.region,
        });
    }

    // 모든 파라미터를 모아서 배열로 반환하도록 수정
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

        const allParameters = [];

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
