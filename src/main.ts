import core from '@actions/core';

async function run() {
    try {
        const awsRoleToAssume = core.getInput('aws-role-to-assume');
        const awsRegion = core.getInput('aws-region');
        const awsPath = core.getInput('aws-path');
        console.log('path', awsPath);
        console.log('awsRegion', awsRegion);
        console.log('awsPath', awsPath);
        core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run();
