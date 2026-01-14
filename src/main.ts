import { getInput, setFailed, setOutput, debug } from '@actions/core';
import { Service } from './service';

async function bootstrap() {
    try {
        const awsRegion = getInput('aws-region');
        const awsBasePath = getInput('aws-base-path');

        const client = new Service({ region: awsRegion });

        const resources = await client.findAll(awsBasePath);
        console.log(resources);
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed(String(error));
        }
    }
}

bootstrap();
