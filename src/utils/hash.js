/**
 * 计算文件hash
 * @param buffer
 * @returns {string}
 */
export async function calculateFileHash(buffer) {
    const encoder = new TextEncoder();
    const data = encoder.encode(buffer);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// // 示例用法
// const fs = require('fs');
// const fileBuffer = fs.readFileSync('/path/to/file');
// const fileHash = calculateFileHash(fileBuffer);
// console.log('文件哈希值：', fileHash);
/**
 * 读取二进制blob流文件
 * @param blob
 * @returns {Promise<unknown>}
 */
export function readBlobData(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target.result;
            resolve(data);
        };

        reader.onerror = function() {
            reject(new Error('无法读取 Blob 文件'));
        };

        reader.readAsDataURL(blob);
    });
}

/**
 * 异步获取文件hash
 * @param blob
 * @returns {Promise<string>}
 */
export async function calcBlobHash(blob) {
    try {
        const data = await readBlobData(blob);
        console.log(data.toString().length);
        console.log('读取的 Blob 数据：', data);
        const hash = calculateFileHash(data);
        return hash;
    } catch (error) {
        console.error('发生错误：', error);
        throw error;
    }
}
