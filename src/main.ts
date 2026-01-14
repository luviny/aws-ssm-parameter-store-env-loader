import core from '@actions/core';

async function run() {
  try {
    const input = core.getInput('example-input');
    console.log(`Hello, ${input}!`);
    // Example of setting an output
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();