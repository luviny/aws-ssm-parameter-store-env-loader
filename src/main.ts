import { getInput, setFailed, setOutput, debug } from '@actions/core';

async function run() {
    try {
        const roleToAssume = getInput('aws-role-to-assume');
        const region = getInput('aws-region') || 'ap-northeast-2';
        const path = getInput('aws-path');

        console.log(`Region: ${region}`);
        console.log(`Path: ${path}`);
        if (roleToAssume) {
            console.log(
                `Role to assume: ${roleToAssume} (Note: Automatic role assumption within this action is not yet implemented. Please use aws-actions/configure-aws-credentials before this step.)`,
            );
        }

        // const command = new GetParametersByPathCommand({
        //   Path: path,
        //   Recursive: true,
        //   WithDecryption: true
        // });
        // const response = await ssmClient.send(command);
        // console.log(`Found ${response.Parameters?.length || 0} parameters.`);
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed(String(error));
        }
    }
}

run();
