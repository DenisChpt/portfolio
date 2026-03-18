export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	NONE = 4,
}

const LOG_LEVEL_CONFIG: Record<string, LogLevel> = {
	development: LogLevel.DEBUG,
	production: LogLevel.ERROR,
	test: LogLevel.NONE,
}

const LOG_COLORS: Record<LogLevel, string> = {
	[LogLevel.DEBUG]: '#9CA3AF',
	[LogLevel.INFO]: '#3B82F6',
	[LogLevel.WARN]: '#F59E0B',
	[LogLevel.ERROR]: '#EF4444',
	[LogLevel.NONE]: '#000000',
}

interface LogEntry {
	timestamp: string
	level: LogLevel
	message: string
	data?: unknown
	context?: string
}

interface LoggerConfig {
	minLevel: LogLevel
	enableConsole: boolean
	contextName?: string
}

class Logger {
	private config: LoggerConfig

	constructor(config?: Partial<LoggerConfig>) {
		const env = import.meta.env.DEV ? 'development' : 'production'
		this.config = {
			minLevel: LOG_LEVEL_CONFIG[env] || LogLevel.INFO,
			enableConsole: true,
			contextName: 'App',
			...config,
		}
	}

	private createLogEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			message,
			context: context || this.config.contextName,
		}

		if (data !== undefined) {
			entry.data = this.sanitizeData(data)
		}

		return entry
	}

	private sanitizeData(data: unknown): unknown {
		if (typeof data === 'string') {
			return data.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[REDACTED_EMAIL]')
		}

		if (typeof data === 'object' && data !== null) {
			if (Array.isArray(data)) {
				return data.map((item) => this.sanitizeData(item))
			}
			const sanitized: Record<string, unknown> = {}
			for (const [key, value] of Object.entries(data)) {
				if (/password|token|secret|api[_-]?key|credential/i.test(key)) {
					sanitized[key] = '[REDACTED]'
				} else {
					sanitized[key] = this.sanitizeData(value)
				}
			}
			return sanitized
		}

		return data
	}

	private formatConsoleMessage(entry: LogEntry): string[] {
		const levelName = LogLevel[entry.level]
		const color = LOG_COLORS[entry.level]
		const prefix = `[${entry.context}] ${levelName}:`
		return [
			`%c${prefix}%c ${entry.message}`,
			`color: ${color}; font-weight: bold;`,
			'color: inherit; font-weight: normal;',
		]
	}

	private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
		if (!this.config.enableConsole || level < this.config.minLevel) return

		const entry = this.createLogEntry(level, message, data, context)
		const [msg, ...styles] = this.formatConsoleMessage(entry)

		switch (entry.level) {
			case LogLevel.DEBUG:
				console.debug(msg, ...styles, entry.data)
				break
			case LogLevel.INFO:
				console.info(msg, ...styles, entry.data)
				break
			case LogLevel.WARN:
				console.warn(msg, ...styles, entry.data)
				break
			case LogLevel.ERROR:
				console.error(msg, ...styles, entry.data)
				break
		}
	}

	public debug(message: string, data?: unknown, context?: string): void {
		this.log(LogLevel.DEBUG, message, data, context)
	}

	public info(message: string, data?: unknown, context?: string): void {
		this.log(LogLevel.INFO, message, data, context)
	}

	public warn(message: string, data?: unknown, context?: string): void {
		this.log(LogLevel.WARN, message, data, context)
	}

	public error(message: string, error?: Error | unknown, context?: string): void {
		const data = error instanceof Error
			? { message: error.message, stack: error.stack, name: error.name }
			: error
		this.log(LogLevel.ERROR, message, data, context)
	}
}

export const logger = new Logger()

export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
	return new Logger({ ...config, contextName: context })
}

export default logger
