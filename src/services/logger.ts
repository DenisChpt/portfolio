/**
 * Professional logging service
 * Provides environment-aware logging with multiple severity levels
 *
 * @module services/logger
 */

import { config } from '@/config'

/**
 * Log levels enumeration
 */
export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	FATAL = 4,
	NONE = 5,
}

/**
 * Log level configuration based on environment
 */
const LOG_LEVEL_CONFIG: Record<string, LogLevel> = {
	development: LogLevel.DEBUG,
	production: LogLevel.ERROR,
	test: LogLevel.NONE,
}

/**
 * Color configuration for console output
 */
const LOG_COLORS: Record<LogLevel, string> = {
	[LogLevel.DEBUG]: '#9CA3AF', // gray
	[LogLevel.INFO]: '#3B82F6', // blue
	[LogLevel.WARN]: '#F59E0B', // amber
	[LogLevel.ERROR]: '#EF4444', // red
	[LogLevel.FATAL]: '#DC2626', // dark red
	[LogLevel.NONE]: '#000000', // black (not used)
}

/**
 * Log entry interface
 */
interface LogEntry {
	timestamp: string
	level: LogLevel
	message: string
	data?: unknown
	context?: string
	stackTrace?: string
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
	minLevel: LogLevel
	enableConsole: boolean
	enableRemote: boolean
	remoteEndpoint?: string
	includeStackTrace: boolean
	contextName?: string
}

/**
 * Logger class implementation
 */
class Logger {
	private config: LoggerConfig
	private buffer: LogEntry[] = []
	private readonly MAX_BUFFER_SIZE = 100

	constructor(config?: Partial<LoggerConfig>) {
		this.config = {
			minLevel: this.getEnvironmentLogLevel(),
			enableConsole: true,
			enableRemote: false,
			includeStackTrace: !config?.enableRemote,
			contextName: 'App',
			...config,
		}
	}

	/**
	 * Get log level based on current environment
	 */
	private getEnvironmentLogLevel(): LogLevel {
		const env = config.isDevelopment ? 'development' : 'production'
		return LOG_LEVEL_CONFIG[env] || LogLevel.INFO
	}

	/**
	 * Create a log entry
	 */
	private createLogEntry(
		level: LogLevel,
		message: string,
		data?: unknown,
		context?: string
	): LogEntry {
		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			message,
			context: context || this.config.contextName,
		}

		if (data !== undefined) {
			entry.data = this.sanitizeData(data)
		}

		if (this.config.includeStackTrace && level >= LogLevel.ERROR) {
			entry.stackTrace = new Error().stack
		}

		return entry
	}

	/**
	 * Sanitize sensitive data from logs
	 */
	private sanitizeData(data: unknown): unknown {
		if (typeof data === 'string') {
			// Remove email addresses
			return data.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[REDACTED_EMAIL]')
		}

		if (typeof data === 'object' && data !== null) {
			const sanitized: any = Array.isArray(data) ? [] : {}

			for (const [key, value] of Object.entries(data)) {
				// Redact sensitive keys
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

	/**
	 * Format log message for console output
	 */
	private formatConsoleMessage(entry: LogEntry): string[] {
		const levelName = LogLevel[entry.level]
		const color = LOG_COLORS[entry.level]
		const prefix = `[${entry.timestamp}] [${entry.context}] ${levelName}:`

		const styles = [
			`color: ${color}; font-weight: bold;`,
			'color: inherit; font-weight: normal;',
		]

		return [`%c${prefix}%c ${entry.message}`, ...styles]
	}

	/**
	 * Write log to console
	 */
	private writeToConsole(entry: LogEntry): void {
		if (!this.config.enableConsole || entry.level < this.config.minLevel) {
			return
		}

		const [message, ...styles] = this.formatConsoleMessage(entry)

		switch (entry.level) {
			case LogLevel.DEBUG:
				console.debug(message, ...styles, entry.data)
				break
			case LogLevel.INFO:
				console.info(message, ...styles, entry.data)
				break
			case LogLevel.WARN:
				console.warn(message, ...styles, entry.data)
				break
			case LogLevel.ERROR:
			case LogLevel.FATAL:
				console.error(message, ...styles, entry.data)
				if (entry.stackTrace) {
					console.error(entry.stackTrace)
				}
				break
		}
	}

	/**
	 * Send log to remote service (placeholder for future implementation)
	 */
	private async sendToRemote(entry: LogEntry): Promise<void> {
		if (!this.config.enableRemote || !this.config.remoteEndpoint) {
			return
		}

		// Buffer logs to send in batches
		this.buffer.push(entry)

		if (this.buffer.length >= this.MAX_BUFFER_SIZE) {
			await this.flushBuffer()
		}
	}

	/**
	 * Flush log buffer to remote service
	 */
	private async flushBuffer(): Promise<void> {
		if (this.buffer.length === 0 || !this.config.remoteEndpoint) {
			return
		}

		const entries = [...this.buffer]
		this.buffer = []

		try {
			// In production, this would send to a real logging service
			await fetch(this.config.remoteEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ logs: entries }),
			})
		} catch (error) {
			// Silently fail to avoid infinite loop
		}
	}

	/**
	 * Main log method
	 */
	private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
		const entry = this.createLogEntry(level, message, data, context)

		this.writeToConsole(entry)
		this.sendToRemote(entry).catch(() => {
			// Silently fail remote logging
		})
	}

	/**
	 * Public logging methods
	 */
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
		const data = error instanceof Error ? {
			message: error.message,
			stack: error.stack,
			name: error.name,
		} : error

		this.log(LogLevel.ERROR, message, data, context)
	}

	public fatal(message: string, error?: Error | unknown, context?: string): void {
		const data = error instanceof Error ? {
			message: error.message,
			stack: error.stack,
			name: error.name,
		} : error

		this.log(LogLevel.FATAL, message, data, context)
	}

	/**
	 * Create a child logger with specific context
	 */
	public child(context: string): Logger {
		return new Logger({
			...this.config,
			contextName: `${this.config.contextName}:${context}`,
		})
	}

	/**
	 * Measure and log performance
	 */
	public time(label: string): () => void {
		const start = performance.now()

		return () => {
			const duration = performance.now() - start
			this.debug(`${label} took ${duration.toFixed(2)}ms`, { duration })
		}
	}

	/**
	 * Log with structured data
	 */
	public structured(level: LogLevel, message: string, metadata: Record<string, unknown>): void {
		this.log(level, message, metadata)
	}

	/**
	 * Set log level dynamically
	 */
	public setLogLevel(level: LogLevel): void {
		this.config.minLevel = level
	}

	/**
	 * Flush any pending logs
	 */
	public async flush(): Promise<void> {
		await this.flushBuffer()
	}
}

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create a logger with specific context
 */
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
	return new Logger({
		...config,
		contextName: context,
	})
}

/**
 * Export for convenience
 */
export default logger