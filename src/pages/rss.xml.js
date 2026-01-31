import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('posts'))
		.filter(post => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: await Promise.all(posts.map(async (post) => {
			const { html } = await render(post);
			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				link: `/posts/${post.id}/`,
				content: sanitizeHtml(html, {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
				}),
			};
		})),
	});
}
