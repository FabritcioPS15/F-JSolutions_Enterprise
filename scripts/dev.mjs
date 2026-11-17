import { stripVTControlCharacters } from 'node:util'
import concurrently, { Logger } from 'concurrently'

class DevLogger extends Logger {
  lastOutput = ''
  startup = new Map()

  constructor() {
    super({ prefixFormat: 'name' })
    this.output.subscribe(({ text }) => {
      this.lastOutput = (this.lastOutput + text).slice(-2)
    })
  }

  separate(command) {
    if (!this.lastOutput || this.lastOutput.endsWith('\n\n')) return
    this.emit(command, this.lastOutput.endsWith('\n') ? '\n' : '\n\n')
  }

  flushStartup(command) {
    const startup = this.startup.get(command)
    if (!startup) return
    clearTimeout(startup.timer)
    this.startup.delete(command)
    this.separate(command)
    super.logCommandText(startup.text, command)
    this.separate(command)
  }

  logCommandText(text, command) {
    let startup = this.startup.get(command)
    if (!startup && stripVTControlCharacters(text).includes('▲ Next.js')) {
      startup = { text: '', timer: setTimeout(() => this.flushStartup(command), 1500) }
      this.startup.set(command, startup)
    }
    if (startup) {
      startup.text += text
      if (/✓\s*Ready in\b/.test(stripVTControlCharacters(startup.text))) this.flushStartup(command)
      return
    }
    super.logCommandText(text, command)
  }
}

const commands = [
  { name: 'WEB', command: 'pnpm --filter fj-solutions-web dev' },
  { name: 'STORE', command: 'pnpm --filter fj-solutions-store dev' },
  { name: 'ADMIN', command: 'pnpm --filter fj-solutions-admin dev' },
  { name: 'ACADEMIA', command: 'pnpm --filter fj-solutions-academy dev' },
  { name: 'LINKEADOR', command: 'pnpm --filter fj-solutions-links dev' },
  { name: 'API', command: 'pnpm --filter fj-solutions-backend dev' },
]

const logger = new DevLogger()
const { commands: runningCommands, result } = concurrently(commands, {
  logger,
  padPrefix: true,
  prefixColors: ['cyan', 'green', 'magenta', 'yellow', 'blue', 'red'],
})

for (const command of runningCommands) {
  command.close.subscribe(() => logger.flushStartup(command))
}

result.then(
  () => { process.exitCode = 0 },
  () => { process.exitCode = 1 },
)
