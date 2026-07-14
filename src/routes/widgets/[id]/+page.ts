import { error } from '@sveltejs/kit';
import { widgets, getWidget, shotsFor } from '$lib/data';
import type { EntryGenerator } from './$types';

export const prerender = true;
export const entries: EntryGenerator = () => widgets.map((w) => ({ id: w.id }));

export function load({ params }: { params: { id: string } }) {
  const widget = getWidget(params.id);
  if (!widget) throw error(404, `Unknown widget ${params.id}`);
  return { widget, shots: shotsFor(params.id) };
}
