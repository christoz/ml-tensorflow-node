module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.toLowerCase().slice(0, 4).includes('wip:')],
}
