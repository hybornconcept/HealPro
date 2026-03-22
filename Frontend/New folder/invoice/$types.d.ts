import type * as Kit from '@sveltejs/kit';

type RouteParams = {};

export type PageServerLoad = Kit.ServerLoad<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
export type PageData = Kit.LoadProperties<Awaited<ReturnType<typeof import('./+page.server.js').load>>>;
