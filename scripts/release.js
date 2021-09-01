const execa = require('execa')

main()

async function main() {
  // run bootstrap
  await execa(require.resolve('lerna/cli'), ['bootstrap'], { stdio: 'inherit' })
  // run test
  await execa(require.resolve('lerna/cli'), ['run', 'test'], { stdio: 'inherit' })
  // run build
  await execa(require.resolve('lerna/cli'), ['run', 'build'], { stdio: 'inherit' })
  // generate changelog
  await execa(require.resolve('lerna/cli'), ['run', 'changelog'], { stdio: 'inherit' })
  // commit build file and changelog
  try {
    await execa('git', ['commit', '-am', 'chore: pre release sync'], { stdio: 'inherit' })
  } catch (error) {
  }

  await execa('git', ['push', '-f'], { stdio: 'inherit' })
  // publish: generate version and push
  await execa(require.resolve('lerna/cli'), ['publish'], { stdio: 'inherit' })
}
