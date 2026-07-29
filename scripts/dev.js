import { spawn } from 'node:child_process';

const services = [
  ['WEB', ['run', 'dev', '-w', '@vha/web']],
  ['API', ['run', 'dev', '-w', '@vha/api']],
  ['BOT', ['run', 'dev', '-w', '@vha/bot']],
];

/**
 * Run npm through its JavaScript CLI when available.
 *
 * On Windows, npm.cmd is a command script rather than a native executable.
 * Spawning it directly can fail with EINVAL on recent Node.js versions.
 * npm_execpath is provided by npm when this file is started via `npm run`.
 */
function createNpmProcess(args) {
  const npmCliPath = process.env.npm_execpath;

  if (npmCliPath) {
    return {
      command: process.execPath,
      args: [npmCliPath, ...args],
      shell: false,
    };
  }

  return {
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args,
    shell: process.platform === 'win32',
  };
}

let stopping = false;
let runningChildren = services.length;

const children = services.map(([name, npmArgs]) => {
  const runner = createNpmProcess(npmArgs);
  const child = spawn(runner.command, runner.args, {
    cwd: process.cwd(),
    env: process.env,
    shell: runner.shell,
    windowsHide: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  child.stdout?.on('data', (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr?.on('data', (chunk) => process.stderr.write(`[${name}] ${chunk}`));

  child.on('error', (error) => {
    console.error(`[${name}] failed to start:`, error);
  });

  child.on('exit', (code, signal) => {
    runningChildren -= 1;

    if (!stopping && code && code !== 0) {
      console.error(`[${name}] exited with code ${code}${signal ? ` (${signal})` : ''}`);
    }

    if (runningChildren === 0) {
      process.exitCode = code && code !== 0 ? code : 0;
    }
  });

  return child;
});

function stop(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`\nStopping development services (${signal})...`);

  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) child.kill('SIGTERM');
    }
  }, 2_000).unref();
}

process.once('SIGINT', () => stop('SIGINT'));
process.once('SIGTERM', () => stop('SIGTERM'));
