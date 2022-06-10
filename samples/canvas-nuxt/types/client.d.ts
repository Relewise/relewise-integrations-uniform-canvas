import { Context } from '@nuxt/types'
import Vue from 'vue'

interface UniformCanvas {
  getCompositionBySlug: ({ slug }: { slug: string }) => Promise<any>
}

export type ExtendedContext = Context & { $uniformCanvasNuxt: UniformCanvas }

declare module 'vue/types/options' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncData?(ctx: ExtendedContext): Promise<object | void> | object | void
  }
}
