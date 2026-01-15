import { exportVariable, getInput, info, setFailed, setOutput, setSecret, startGroup } from '@actions/core';
import { Service } from './service';
import * as fs from 'node:fs';
import * as zlib from 'node:zlib';

async function bootstrap() {
    try {
        const awsRegion = getInput('aws-region');
        const awsBasePath = getInput('aws-base-path');
        const isLoadEnv = getInput('load-env') === 'true';
        const envFileName = getInput('env-file-name');

        const service = new Service({ region: awsRegion });

        startGroup('Fetch SSM Parameters');
        const res = await service.findAll(awsBasePath);
        const parameters = res || [];

        info(`Total ${parameters.length} parameter(s) fetched from ${awsBasePath}`);

        if (!parameters.length) return;

        info('Processing parameter encryption');
        for (const parameter of parameters) {
            if (!parameter.Value) continue;
            setSecret(parameter.Value);
        }

        if (isLoadEnv) {
            info('Starting to load environment variables to GitHub Actions');
            for (const parameter of parameters) {
                if (!parameter.Name || !parameter.Value) continue;
                exportVariable(service.transformKey(parameter.Name), parameter.Value);
            }
        }

        if (envFileName) {
            info(`Starting to create environment file: ${envFileName}`);

            const envFile = fs.createWriteStream(envFileName);
            for (const parameter of parameters) {
                if (!parameter.Name || !parameter.Value) continue;
                envFile.write(`${service.transformKey(parameter.Name)}="${parameter.Value.replace(/\n/g, '\\n')}"\n`);
            }
            envFile.end();

            info(`Environment file creation completed.`);
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
