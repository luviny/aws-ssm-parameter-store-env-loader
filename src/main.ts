import { getInput, setFailed, setOutput, debug, exportVariable, setSecret } from '@actions/core';
import { Service } from './service';
import * as fs from 'node:fs';

async function bootstrap() {
    try {
        const awsRegion = getInput('aws-region');
        const awsBasePath = getInput('aws-base-path');
        const isLoadEnv = getInput('load-env') === 'true';
        const envFileName = getInput('env-file-name');
        console.log(envFileName);
        const service = new Service({ region: awsRegion });

        const res = await service.findAll(awsBasePath);
        const parameters = res?.Parameters || [];

        for (const parameter of parameters) {
            if (parameter.Value) setSecret(parameter.Value);
        }

        if (isLoadEnv) {
            for (const parameter of parameters) {
                if (!parameter.Name || !parameter.Value) return;
                exportVariable(service.transformKey(parameter.Name), parameter.Value);
            }
        }

        if (envFileName) {
            debug(`Starting to create environment file: ${envFileName}`);

            const envFile = fs.createWriteStream(envFileName);
            for (const parameter of res?.Parameters || []) {
                if (!parameter.Name || !parameter.Value) return;
                envFile.write(`${service.transformKey(parameter.Name)}="${parameter.Value}"\n`);
            }
            envFile.end();

            debug(`Environment file creation completed: ${envFileName}`);
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
