export type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner'

export interface ProgrammingSkill {
	name: string
	level: SkillLevel
}

/**
 * Programming languages with skill levels
 */
export const PROGRAMMING_SKILLS: ProgrammingSkill[] = [
	{ name: 'Python', level: 'expert' },
	{ name: 'Rust', level: 'expert' },
	{ name: 'C++', level: 'advanced' },
	{ name: 'Vue.js', level: 'intermediate' },
	{ name: 'TypeScript', level: 'beginner' },
]
