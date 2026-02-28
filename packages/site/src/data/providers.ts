export interface InstallMethod {
  name?: string;
  command?: string;
  steps: string[];
}

export interface Provider {
  id: string;
  name: string;
  methods: InstallMethod[];
}

export const providers: Provider[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    methods: [
      {
        name: 'Marketplace',
        command: '/plugin marketplace add derekherman/walter',
        steps: [
          'Run <code>/plugin install walter@walter</code> or browse via <code>/plugin</code>',
          'Walter appears in <code>/skills</code> menu',
          'Set <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code> for agent teams'
        ]
      },
      {
        name: 'Download',
        steps: [
          'Unzip to get <code>walter/</code> with agents, commands, and skills',
          'Move contents into <code>.claude/</code> in your project or <code>~/.claude/</code>',
          'Walter appears in <code>/skills</code> menu',
          'Set <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code> for agent teams'
        ]
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    methods: [
      {
        steps: [
          'Unzip to get <code>walter/</code> with agents, commands, and skills',
          'Move contents into <code>.gemini/</code> in your project or <code>~/.gemini/</code>',
          'Run <code>/skills list</code> to verify'
        ]
      }
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    methods: [
      {
        steps: [
          'Unzip to get <code>walter/</code> with commands and skills',
          'Move contents into <code>.cursor/</code> in your project or <code>~/.cursor/</code>',
          'Commands and skills auto-discovered by Cursor',
          'Agents not yet supported by Cursor'
        ]
      }
    ]
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    methods: [
      {
        steps: [
          'Unzip to get <code>walter/</code> with prompts and skills',
          'Move contents into <code>.codex/</code> in your project or <code>~/.codex/</code>',
          'Commands invoked as <code>/prompts:cook</code>, etc.',
          'Agents not yet supported by Codex'
        ]
      }
    ]
  }
];
