import { getInput, setFailed, setOutput, debug, exportVariable, setSecret } from '@actions/core';
import { Service } from './service';

async function bootstrap() {
    try {
        const awsRegion = getInput('aws-region');
        const awsBasePath = getInput('aws-base-path');

        const service = new Service({ region: awsRegion });

        const res = await service.findAll(awsBasePath);

        for (const parameter of res?.Parameters || []) {
            if (!parameter.Name || !parameter.Value) return;
            setSecret(parameter.Value);
            exportVariable(service.transformKey(parameter.Name), parameter.Value);
        }
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed(String(error));
        }
    }
}

bootstrap();
