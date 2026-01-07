import { Instruction } from "../../app/model"
import { gs } from "../instructions"

export const instruction_paginator: Instruction = {
    name: 'paginator',
    update: async (text: string, style: string, length: string, page: string) => {
        const len = parseInt(length, 10)
        let reqPage = parseInt(page, 10)
        if (isNaN(len) || isNaN(reqPage)) {
            return `usage: paginator${gs}style${gs}length${gs}page`
        }

        if (!text) return ``

        let splits: { start: number, end: number, decoration: string }[] = []

        if (style === 'suffix') {
            let totalPages = 1

            // Iterative approach to stabilize total pages count
            for (let attempt = 0; attempt < 3; attempt++) {
                splits = []
                let offset = 0
                let p = 1

                while (offset < text.length) {
                    const footer = `\n${p}/${totalPages}`
                    const contentLen = len - footer.length

                    if (contentLen <= 0) return 'error: length too small'

                    let end = offset + contentLen
                    if (end > text.length) end = text.length

                    splits.push({ start: offset, end, decoration: footer })
                    offset = end
                    p++
                }

                const newTotal = splits.length
                if (newTotal === totalPages) break
                totalPages = newTotal
            }
        } else if (style === 'prefix') {
            let offset = 0
            let p = 1
            while (offset < text.length) {
                const prefix = `${p}) `
                const contentLen = len - prefix.length

                if (contentLen <= 0) return 'error: length too small'

                let end = offset + contentLen
                if (end > text.length) end = text.length

                splits.push({ start: offset, end, decoration: prefix })
                offset = end
                p++
            }
        } else {
            // Placeholder for custom styles
            return `style "${style}" not implemented`
        }

        // Check for empty splits
        if (splits.length === 0) return style === 'prefix' ? '1) ' : ' 1/1'

        // 1-based indexing for user input
        reqPage = reqPage - 1

        if (reqPage >= splits.length) return ''
        if (reqPage < 0) reqPage = 0

        const chunk = splits[reqPage]
        const content = text.substring(chunk.start, chunk.end)

        if (style === 'prefix') {
            return chunk.decoration + content
        } else {
            return content + chunk.decoration
        }
    },
    manual: false
}
