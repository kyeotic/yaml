// Published as 'yaml/seq'

import toJSON from '../toJSON'
import Collection from './Collection'

export default class YAMLSeq extends Collection {
  toJSON(_, keep) {
    return this.items.map((v, i) => toJSON(v, String(i), keep))
  }

  toString(ctx, onComment) {
    if (!ctx) return JSON.stringify(this)
    return super.toString(
      ctx,
      {
        blockItem: ({ type, str }) => (type === 'comment' ? str : `- ${str}`),
        flowChars: { start: '[', end: ']' },
        itemIndent: (ctx.indent || '') + '  '
      },
      onComment
    )
  }
}
