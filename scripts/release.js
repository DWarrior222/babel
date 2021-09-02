const execa = require('execa')
const lerna = require.resolve('lerna/cli');

main()

async function main() {
  // run bootstrap
  await execa(lerna, ['bootstrap'], { stdio: 'inherit' })
  // run test
  await execa(lerna, ['run', 'test'], { stdio: 'inherit' })
  // run build
  await execa(lerna, ['run', 'build'], { stdio: 'inherit' })
  // generate changelog
  await execa(lerna, ['run', 'changelog'], { stdio: 'inherit' })
  // commit build file and changelog
  try {
    await execa('git', ['commit', '-am', 'chore: pre release sync'], { stdio: 'inherit' })
  } catch (error) {
  }

  await execa('git', ['push', '-f'], { stdio: 'inherit' })
  // publish: generate version and push
  await execa(lerna, ['publish'], { stdio: 'inherit' })
}
