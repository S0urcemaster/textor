import { test, expect, type Page } from '@playwright/test'

const editorSelector = 'div[contenteditable="true"]'

const readEditorText = async (page: Page) =>
	page.evaluate(() => {
		const editor = document.querySelector('div[contenteditable="true"]')
		if (!editor) return ''
		let out = ''
		const walk = (node: Node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				const value = node.textContent ?? ''
				out += value.replace(/\u200B/g, '')
				return
			}
			if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
				out += '\n'
				return
			}
			for (const child of Array.from(node.childNodes)) {
				walk(child)
			}
		}
		walk(editor)
		return out
	})

test('typing updates editor text', async ({ page }) => {
	await page.goto('/')
	const editor = page.locator(editorSelector)
	await expect(editor).toBeVisible()
	await editor.click()
	await page.keyboard.type('Hello #tag')

	const text = await readEditorText(page)
	expect(text).toBe('Hello #tag')

	const html = await editor.evaluate(el => el.innerHTML)
	expect(html).toContain('#tag')
	expect(html).toContain('<span')
})

test('enter inserts newline', async ({ page }) => {
	await page.goto('/')
	const editor = page.locator(editorSelector)
	await editor.click()
	await page.keyboard.type('Line1')
	await page.keyboard.press('Enter')
	await page.keyboard.type('Line2')

	const text = await readEditorText(page)
	expect(text).toBe('Line1\nLine2')
})

test('paste inserts plain text', async ({ page }) => {
	await page.goto('/')
	const editor = page.locator(editorSelector)
	await editor.click()

	await page.evaluate(async () => {
		await navigator.clipboard.writeText('Paste me')
	})
	const isMac = await page.evaluate(() => /Mac/i.test(navigator.platform))
	const pasteShortcut = isMac ? 'Meta+V' : 'Control+V'
	await page.keyboard.press(pasteShortcut)

	const text = await readEditorText(page)
	expect(text).toContain('Paste me')
})
